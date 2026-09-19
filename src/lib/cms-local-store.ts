import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  CMS_SETTINGS_GROUP_KEYS,
  EMPTY_STORE,
  fallbackRecords,
  type CmsAccessLog,
  type CmsCategoryRecord,
  type CmsContentRecord,
  type CmsLeadRecord,
  type CmsLocalStore,
  type CmsMediaRecord,
  type CmsSettingsGroupKey,
  type CmsSettingsMap,
  type CmsUserRecord,
  type CollectionKey,
} from "@/lib/cms-records";

const STORE_PATH = path.join(process.cwd(), "data", "cms-local.json");

function isStore(value: unknown): value is CmsLocalStore | (CmsLocalStore & { version: 1 | 2 }) {
  if (!value || typeof value !== "object") return false;
  const store = value as { version?: unknown; projects?: unknown };
  return (store.version === 1 || store.version === 2) && Array.isArray(store.projects);
}

function migrateStore(parsed: CmsLocalStore): CmsLocalStore {
  return {
    ...EMPTY_STORE,
    ...parsed,
    version: 2,
    categories: parsed.categories || [],
    media: parsed.media || [],
    gallery: parsed.gallery || [],
    accessLogs: parsed.accessLogs || [],
    settingRows: parsed.settingRows || [],
    settings: { ...EMPTY_STORE.settings, ...parsed.settings },
  };
}

export async function readLocalStore(): Promise<CmsLocalStore> {
  try {
    const raw = await readFile(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    if (!isStore(parsed)) return structuredClone(EMPTY_STORE);
    return migrateStore(parsed as CmsLocalStore);
  } catch {
    return structuredClone(EMPTY_STORE);
  }
}

function contentCount(store: CmsLocalStore) {
  return store.projects.length + store.services.length + store.articles.length + store.pages.length;
}

export async function writeLocalStore(store: CmsLocalStore) {
  await mkdir(path.dirname(STORE_PATH), { recursive: true });
  let existing: CmsLocalStore | null = null;
  try {
    const parsed = JSON.parse(await readFile(STORE_PATH, "utf8")) as unknown;
    if (isStore(parsed)) existing = migrateStore(parsed as CmsLocalStore);
  } catch {
    existing = null;
  }

  const next = store;
  if (existing && contentCount(existing) > 0 && contentCount(store) === 0 && !store.source) {
    next.projects = existing.projects;
    next.services = existing.services;
    next.articles = existing.articles;
    next.pages = existing.pages;
    next.categories = existing.categories;
    next.media = existing.media;
    next.gallery = existing.gallery;
    next.contacts = store.contacts.length ? store.contacts : existing.contacts;
    next.settings = existing.settings;
    next.settingRows = existing.settingRows;
    next.source = existing.source;
    next.importedAt = existing.importedAt;
  }

  await writeFile(STORE_PATH, JSON.stringify(next, null, 2), "utf8");
}

export async function getStoredCollection(key: CollectionKey): Promise<CmsContentRecord[]> {
  const store = await readLocalStore();
  return store[key];
}

export async function getCollectionRecords(key: CollectionKey): Promise<CmsContentRecord[]> {
  const stored = await getStoredCollection(key);
  return stored.length ? stored : fallbackRecords(key);
}

export async function saveCollectionRecords(key: CollectionKey, records: CmsContentRecord[]) {
  const store = await readLocalStore();
  store[key] = records;
  await writeLocalStore(store);
  return records;
}

export async function upsertRecord(key: CollectionKey, record: CmsContentRecord) {
  const records = await getCollectionRecords(key);
  const index = records.findIndex((item) => item.slug === record.slug);
  const next = { ...record, updatedAt: new Date().toISOString() };
  if (index >= 0) records[index] = next;
  else records.unshift(next);
  await saveCollectionRecords(key, records);
  return next;
}

export async function deleteRecord(key: CollectionKey, slug: string) {
  const records = (await getCollectionRecords(key)).filter((item) => item.slug !== slug);
  await saveCollectionRecords(key, records);
  return records;
}

export async function getLocalSettings(group: CmsSettingsGroupKey): Promise<CmsSettingsMap> {
  const store = await readLocalStore();
  return store.settings[group] || {};
}

export async function saveLocalSettings(group: CmsSettingsGroupKey, values: CmsSettingsMap) {
  const store = await readLocalStore();
  store.settings[group] = { ...store.settings[group], ...values };
  store.settingRows = store.settingRows.map((row) =>
    row.group === group && row.key in values ? { ...row, value: values[row.key] ?? row.value } : row,
  );
  for (const [key, value] of Object.entries(values)) {
    if (store.settingRows.some((row) => row.group === group && row.key === key)) continue;
    store.settingRows.push({ key, value, group, description: "" });
  }
  await writeLocalStore(store);
  return store.settings[group];
}

export function isSettingsGroup(value: string): value is CmsSettingsGroupKey {
  return CMS_SETTINGS_GROUP_KEYS.includes(value as CmsSettingsGroupKey);
}

export async function listCategories() {
  const store = await readLocalStore();
  return [...store.categories].sort((a, b) => a.sortOrder - b.sortOrder || a.categoryId - b.categoryId);
}

export async function saveCategories(categories: CmsCategoryRecord[]) {
  const store = await readLocalStore();
  store.categories = categories;
  await writeLocalStore(store);
  return categories;
}

export async function upsertCategory(category: CmsCategoryRecord) {
  const categories = await listCategories();
  const index = categories.findIndex((item) => item.categoryId === category.categoryId || item.slug === category.slug);
  const next = { ...category, updatedAt: new Date().toISOString() };
  if (index >= 0) categories[index] = { ...categories[index], ...next };
  else categories.push(next);
  await saveCategories(categories);
  return next;
}

export async function deleteCategory(categoryId: number) {
  const categories = (await listCategories()).filter((item) => item.categoryId !== categoryId);
  await saveCategories(categories);
  return categories;
}

export async function listMedia() {
  const store = await readLocalStore();
  return store.media;
}

export async function saveMedia(media: CmsMediaRecord[]) {
  const store = await readLocalStore();
  store.media = media;
  await writeLocalStore(store);
  return media;
}

export async function listLeads() {
  const store = await readLocalStore();
  return [...store.contacts].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function addLead(input: Omit<CmsLeadRecord, "id" | "createdAt" | "status">) {
  const store = await readLocalStore();
  const lead: CmsLeadRecord = {
    ...input,
    id: `lead-${Date.now()}`,
    status: "new",
    createdAt: new Date().toISOString(),
  };
  store.contacts.unshift(lead);
  await writeLocalStore(store);
  return lead;
}

export async function updateLead(id: string, patch: Partial<CmsLeadRecord>) {
  const store = await readLocalStore();
  const index = store.contacts.findIndex((item) => item.id === id);
  if (index < 0) return null;
  store.contacts[index] = { ...store.contacts[index], ...patch, id };
  await writeLocalStore(store);
  return store.contacts[index];
}

export async function listUsers() {
  const store = await readLocalStore();
  if (store.users.length) return store.users;
  return [defaultAdminUser()];
}

export function defaultAdminUser(): CmsUserRecord {
  return {
    username: process.env.CMS_ADMIN_USER || "admin",
    displayName: process.env.CMS_ADMIN_USER || "admin",
    role: "admin",
    status: "active",
    lastLoginAt: "",
    email: "",
    phone: "",
    gender: "Nam",
    birthday: "",
    address: "",
    avatarUrl: "",
  };
}

export async function saveUsers(users: CmsLocalStore["users"]) {
  const store = await readLocalStore();
  store.users = users;
  await writeLocalStore(store);
  return users;
}

export async function getAdminUser(username?: string | null) {
  const users = await listUsers();
  if (username) {
    return users.find((item) => item.username === username) || users[0] || defaultAdminUser();
  }
  return users[0] || defaultAdminUser();
}

export async function upsertAdminUser(patch: Partial<CmsUserRecord> & { username: string }) {
  const store = await readLocalStore();
  const users = store.users.length ? store.users : [defaultAdminUser()];
  const index = users.findIndex((item) => item.username === patch.username);
  const current = index >= 0 ? users[index] : defaultAdminUser();
  const next: CmsUserRecord = { ...current, ...patch, username: patch.username };
  if (index >= 0) users[index] = next;
  else users.unshift(next);
  store.users = users;
  await writeLocalStore(store);
  return next;
}

export async function listAccessLogs() {
  const store = await readLocalStore();
  return [...(store.accessLogs || [])].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function addAccessLog(input: Omit<CmsAccessLog, "id" | "createdAt"> & { createdAt?: string }) {
  const store = await readLocalStore();
  const logs = store.accessLogs || [];
  const last = logs[0];
  const now = input.createdAt || new Date().toISOString();
  if (
    last &&
    last.username === input.username &&
    last.ip === input.ip &&
    last.browser === input.browser &&
    Date.now() - new Date(last.createdAt).getTime() < 20_000
  ) {
    return last;
  }
  const log: CmsAccessLog = {
    ...input,
    id: `access-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    createdAt: now,
  };
  store.accessLogs = [log, ...logs].slice(0, 500);
  await writeLocalStore(store);
  return log;
}
