'use client';

import { useState, type FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import {
  CATEGORY_META,
  submitHarness,
  type HarnessCategory,
} from '@/lib/api';

const CATEGORIES: HarnessCategory[] = [
  'CODING_AGENT',
  'EVAL_HARNESS',
  'RAG_FRAMEWORK',
  'RESEARCH_AGENT',
  'TOOL_USE',
  'MULTI_AGENT',
  'BROWSER_AGENT',
  'DATA_PIPELINE',
  'OTHER',
];

const MODELS = [
  { id: 'claude', label: 'Claude' },
  { id: 'gpt-4o', label: 'GPT-4o' },
  { id: 'gemini', label: 'Gemini' },
  { id: 'llama', label: 'Llama' },
];

interface GitHubRepoResponse {
  name: string;
  full_name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  topics?: string[];
  license: { spdx_id?: string | null; name?: string | null } | null;
  owner: { login: string };
  html_url: string;
}

type ExtractedMeta = {
  name: string;
  orgName: string;
  description: string;
  license: string;
  languages: string[];
  tags: string[];
  stars: number;
  category: HarnessCategory;
  repoUrl: string;
};

function parseRepoUrl(url: string): { org: string; name: string } | null {
  const match = url.match(/github\.com\/([^/]+)\/([^/?#]+)/i);
  if (!match) return null;
  return { org: match[1], name: match[2].replace(/\.git$/, '') };
}

function guessCategory(topics: string[], description: string): HarnessCategory {
  const blob = [...topics, description].join(' ').toLowerCase();
  if (/(coding|swe|developer|programmer|code-agent|ide)/.test(blob)) return 'CODING_AGENT';
  if (/(eval|benchmark|harness)/.test(blob)) return 'EVAL_HARNESS';
  if (/(rag|retrieval|vector|embedding)/.test(blob)) return 'RAG_FRAMEWORK';
  if (/(research|paper|literature|search)/.test(blob)) return 'RESEARCH_AGENT';
  if (/(tool[- ]?use|function[- ]?call|mcp)/.test(blob)) return 'TOOL_USE';
  if (/(multi[- ]?agent|crew|swarm|autogen)/.test(blob)) return 'MULTI_AGENT';
  if (/(browser|playwright|puppeteer|selenium|web[- ]?agent)/.test(blob)) return 'BROWSER_AGENT';
  if (/(pipeline|etl|workflow|data)/.test(blob)) return 'DATA_PIPELINE';
  return 'OTHER';
}

export default function SubmitPage() {
  const t = useTranslations('Submit');
  const [repoUrl, setRepoUrl] = useState('');
  const [extracted, setExtracted] = useState<ExtractedMeta | null>(null);
  const [installCmd, setInstallCmd] = useState('');
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [fetching, setFetching] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  const handleExtract = async () => {
    setError('');
    setExtracted(null);
    const parsed = parseRepoUrl(repoUrl.trim());
    if (!parsed) {
      setError('Enter a valid GitHub URL (https://github.com/org/repo).');
      return;
    }
    setFetching(true);
    try {
      const res = await fetch(
        `https://api.github.com/repos/${parsed.org}/${parsed.name}`,
        { headers: { Accept: 'application/vnd.github+json' } },
      );
      if (!res.ok) {
        if (res.status === 404) {
          setError('Repository not found. Check the URL and visibility.');
        } else if (res.status === 403) {
          setError('GitHub API rate limit reached. Try again in a few minutes.');
        } else {
          setError(`GitHub API error (${res.status}).`);
        }
        return;
      }
      const data = (await res.json()) as GitHubRepoResponse;
      const topics = data.topics ?? [];
      const description = data.description ?? '';
      const license =
        data.license?.spdx_id && data.license.spdx_id !== 'NOASSERTION'
          ? data.license.spdx_id
          : data.license?.name ?? '';
      setExtracted({
        name: data.name,
        orgName: data.owner.login,
        description,
        license,
        languages: data.language ? [data.language.toLowerCase()] : [],
        tags: topics,
        stars: data.stargazers_count ?? 0,
        category: guessCategory(topics, description),
        repoUrl: data.html_url,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Network error';
      setError(`Failed to fetch repo metadata: ${msg}`);
    } finally {
      setFetching(false);
    }
  };

  const toggleModel = (id: string) => {
    setSelectedModels((arr) =>
      arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id],
    );
  };

  const onChange = <K extends keyof ExtractedMeta>(field: K, value: ExtractedMeta[K]) => {
    if (!extracted) return;
    setExtracted({ ...extracted, [field]: value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!extracted) return;
    setSubmitting(true);
    setError('');
    const result = await submitHarness({
      repoUrl: extracted.repoUrl,
      name: extracted.name,
      orgName: extracted.orgName,
      description: extracted.description,
      license: extracted.license || undefined,
      languages: extracted.languages,
      tags: extracted.tags,
      stars: extracted.stars,
      category: extracted.category,
      installCmd: installCmd || undefined,
      modelCompat: selectedModels,
    });
    setSubmitting(false);
    if (result.ok) {
      if (result.message) setSuccessMessage(result.message);
      setDone(true);
    } else {
      setError(
        result.message
          ? `Submission failed: ${result.message}`
          : 'Submission failed. Please try again.',
      );
    }
  };

  if (done) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-6 py-20"
        style={{ backgroundColor: 'var(--bg)' }}
      >
        <div className="max-w-md text-center">
          <div
            className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center"
            style={{ backgroundColor: 'rgba(74, 222, 128, 0.12)' }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 32, color: 'var(--success)' }}
            >
              check_circle
            </span>
          </div>
          <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--text)' }}>
            {t('success')}
          </h2>
          {successMessage && (
            <p className="text-sm mb-2" style={{ color: 'var(--text-2)' }}>
              {successMessage}
            </p>
          )}
          <Link
            href="/explore"
            className="inline-block mt-4 px-5 py-2.5 rounded-lg font-bold"
            style={{
              background: 'linear-gradient(135deg, #00E5FF 0%, #A78BFA 100%)',
              color: '#0A0E14',
            }}
          >
            Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text)' }}>
          {t('title')}
        </h1>
        <p style={{ color: 'var(--text-3)' }}>{t('subtitle')}</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border p-6 md:p-8 space-y-6"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        {/* Repo URL */}
        <div>
          <label className="block mb-2 text-sm font-medium" style={{ color: 'var(--text-2)' }}>
            {t('repoUrl')} <span style={{ color: 'var(--danger)' }}>*</span>
          </label>
          <div className="flex gap-2 flex-col sm:flex-row">
            <input
              type="url"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/org/repo"
              className="flex-1 px-4 py-3 rounded-lg border font-mono-code text-sm outline-none"
              style={{
                backgroundColor: 'var(--bg-raised)',
                borderColor: 'var(--border)',
                color: 'var(--text)',
              }}
            />
            <button
              type="button"
              onClick={handleExtract}
              disabled={fetching}
              className="px-5 py-3 rounded-lg font-bold text-sm transition-all disabled:opacity-60"
              style={{
                background: 'linear-gradient(135deg, #00E5FF 0%, #A78BFA 100%)',
                color: '#0A0E14',
              }}
            >
              {fetching ? 'Fetching…' : 'Fetch metadata'}
            </button>
          </div>
          {error && (
            <p className="mt-2 text-xs" style={{ color: 'var(--danger)' }}>
              {error}
            </p>
          )}
        </div>

        {extracted && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label={t('name')} required>
                <input
                  value={extracted.name}
                  onChange={(e) => onChange('name', e.target.value)}
                  className="form-input"
                />
              </Field>
              <Field
                label={t('orgName')}
                hint={t('orgNameHint')}
                locked
              >
                <div className="relative">
                  <input
                    value={extracted.orgName}
                    disabled
                    aria-readonly="true"
                    className="form-input form-input-locked pr-10"
                  />
                  <span
                    className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ fontSize: 16, color: 'var(--text-4)' }}
                    aria-hidden="true"
                  >
                    lock
                  </span>
                </div>
              </Field>
            </div>

            <Field label={t('description')} required>
              <textarea
                rows={4}
                value={extracted.description}
                onChange={(e) => onChange('description', e.target.value)}
                placeholder="What does this harness do?"
                className="form-input"
              />
            </Field>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label={t('license')}>
                <input
                  value={extracted.license}
                  readOnly
                  className="form-input"
                  placeholder="—"
                />
              </Field>
              <Field label={t('languages')}>
                <input
                  value={extracted.languages.join(', ')}
                  readOnly
                  className="form-input"
                  placeholder="—"
                />
              </Field>
              <Field label="Stars">
                <input
                  value={extracted.stars.toLocaleString()}
                  readOnly
                  className="form-input font-mono-code"
                />
              </Field>
            </div>

            <Field label={t('tags')}>
              <input
                value={extracted.tags.join(', ')}
                readOnly
                className="form-input"
                placeholder="No topics on GitHub"
              />
            </Field>

            <Field label={t('category')}>
              <select
                value={extracted.category}
                onChange={(e) => onChange('category', e.target.value as HarnessCategory)}
                className="form-input"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} style={{ backgroundColor: 'var(--bg-card)' }}>
                    {CATEGORY_META[c].label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label={t('installCmd')}>
              <input
                value={installCmd}
                onChange={(e) => setInstallCmd(e.target.value)}
                placeholder="pip install your-package"
                className="form-input font-mono-code"
              />
            </Field>

            <div>
              <p
                className="block mb-2 text-sm font-medium"
                style={{ color: 'var(--text-2)' }}
              >
                {t('modelCompat')}
              </p>
              <div className="flex flex-wrap gap-2">
                {MODELS.map((m) => {
                  const checked = selectedModels.includes(m.id);
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => toggleModel(m.id)}
                      className="text-xs font-medium px-3 py-1.5 rounded-md border transition-colors inline-flex items-center gap-1.5"
                      style={{
                        backgroundColor: checked
                          ? 'rgba(0, 229, 255, 0.12)'
                          : 'var(--bg-raised)',
                        borderColor: checked ? 'var(--accent)' : 'var(--border)',
                        color: checked ? 'var(--accent)' : 'var(--text-2)',
                      }}
                    >
                      {checked && (
                        <span
                          className="material-symbols-outlined"
                          style={{ fontSize: 14 }}
                        >
                          check
                        </span>
                      )}
                      {m.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full px-6 py-4 rounded-xl font-bold text-base transition-all disabled:opacity-60"
              style={{
                background: 'linear-gradient(135deg, #00E5FF 0%, #A78BFA 100%)',
                color: '#0A0E14',
              }}
            >
              {submitting ? t('submitting') : t('submit')}
            </button>
          </>
        )}
      </form>

      <style>{`
        .form-input {
          width: 100%;
          padding: 12px 16px;
          border-radius: 10px;
          background-color: var(--bg-raised);
          border: 1px solid var(--border);
          color: var(--text);
          font-size: 14px;
          outline: none;
        }
        .form-input:focus {
          border-color: var(--accent);
        }
        .form-input::placeholder {
          color: var(--text-4);
        }
        .form-input[readonly] {
          color: var(--text-3);
          cursor: not-allowed;
        }
        .form-input:disabled,
        .form-input-locked {
          opacity: 0.7;
          cursor: not-allowed;
          color: var(--text-3);
          background-color: var(--bg);
        }
      `}</style>
    </main>
  );
}

function Field({
  label,
  required,
  hint,
  locked,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  locked?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        className="mb-2 text-sm font-medium flex items-center gap-1.5 flex-wrap"
        style={{ color: 'var(--text-2)' }}
      >
        <span className="inline-flex items-center gap-1">
          {locked && (
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 14, color: 'var(--text-4)' }}
              aria-hidden="true"
            >
              lock
            </span>
          )}
          {label}
          {required && <span style={{ color: 'var(--danger)' }}> *</span>}
        </span>
        {hint && (
          <span
            className="text-[11px] font-normal"
            style={{ color: 'var(--text-4)' }}
          >
            {hint}
          </span>
        )}
      </label>
      {children}
    </div>
  );
}
