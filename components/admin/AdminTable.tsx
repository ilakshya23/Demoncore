'use client';

import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui';
import { StaffSkinField } from '@/components/admin/StaffSkinField';

export type FieldType = 'text' | 'textarea' | 'number' | 'list' | 'color' | 'select' | 'staff-skin';

export type FieldConfig = {
  key: string;
  label: string;
  type: FieldType;
  options?: string[]; // for 'select'
  placeholder?: string;
};

type Row = Record<string, any>;

function emptyRowFrom(fields: FieldConfig[], fixed: Row): Row {
  const row: Row = { ...fixed };
  for (const f of fields) {
    // 'staff-skin' is a compound UI over two real columns, not a column itself.
    if (f.type === 'staff-skin') {
      row.minecraft_username = '';
      row.skin_url = '';
    } else {
      row[f.key] = f.type === 'list' ? [] : f.type === 'number' ? 0 : '';
    }
  }
  return row;
}

export function AdminTable({
  table,
  fields,
  fixedValues = {},
  title,
}: {
  table: string;
  fields: FieldConfig[];
  fixedValues?: Row; // values always sent on insert (e.g. { gamemode: 'survival' })
  title: string;
}) {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savingIds, setSavingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch(`/api/admin/${table}`)
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        const filtered = Object.keys(fixedValues).length
          ? list.filter((r) => Object.entries(fixedValues).every(([k, v]) => r[k] === v))
          : list;
        setRows(filtered);
      })
      .catch(() => setError('Could not load data'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table]);

  function updateLocal(id: string, patch: Row) {
    setRows((prev) => (prev ? prev.map((r) => (r.id === id ? { ...r, ...patch } : r)) : prev));
  }

  async function persist(id: string, patch: Row) {
    setSavingIds((s) => new Set(s).add(id));
    try {
      const res = await fetch(`/api/admin/${table}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...patch }),
      });
      if (!res.ok) throw new Error();
    } catch {
      setError('A change failed to save — refresh to check the current state.');
    } finally {
      setSavingIds((s) => {
        const next = new Set(s);
        next.delete(id);
        return next;
      });
    }
  }

  async function handleAdd() {
    const draft = emptyRowFrom(fields, fixedValues);
    // Optimistic temp row so adding feels instant; replaced with the real
    // row (real id) once the insert responds.
    const tempId = `temp-${Date.now()}`;
    setRows((prev) => [...(prev ?? []), { ...draft, id: tempId }]);

    try {
      const res = await fetch(`/api/admin/${table}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      });
      if (!res.ok) throw new Error();
      const created = await res.json();
      setRows((prev) => (prev ? prev.map((r) => (r.id === tempId ? created : r)) : prev));
    } catch {
      setRows((prev) => (prev ? prev.filter((r) => r.id !== tempId) : prev));
      setError('Could not add a new row.');
    }
  }

  async function handleDelete(id: string) {
    const prevRows = rows;
    setRows((prev) => (prev ? prev.filter((r) => r.id !== id) : prev)); // optimistic remove

    try {
      const res = await fetch(`/api/admin/${table}?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
    } catch {
      setRows(prevRows); // rollback
      setError('Could not delete that row.');
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-parchment">{title}</h1>
        <button
          onClick={handleAdd}
          className="cursor-target border border-core-ember px-4 py-2 text-xs uppercase tracking-wide text-core-ember hover:bg-core-ember hover:text-void transition-colors"
        >
          Add New
        </button>
      </div>

      {error && (
        <p className="mb-4 text-sm text-core-ember border border-core-ember/40 px-4 py-2.5">{error}</p>
      )}

      {rows === null ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <p className="text-ash text-sm">Nothing here yet — click "Add New" to create the first entry.</p>
      ) : (
        <div className="space-y-4">
          {rows.map((row) => (
            <div
              key={row.id}
              className="border border-white/10 hover:border-core-ember/60 focus-within:border-core-ember p-5 transition-colors"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fields.map((field) =>
                  field.type === 'staff-skin' ? (
                    <StaffSkinField
                      key={field.key}
                      minecraftUsername={row.minecraft_username ?? ''}
                      skinUrl={row.skin_url ?? ''}
                      onChange={(patch) => {
                        updateLocal(row.id, patch);
                        persist(row.id, patch);
                      }}
                    />
                  ) : (
                    <FieldInput
                      key={field.key}
                      field={field}
                      value={row[field.key]}
                      onChange={(value) => {
                        updateLocal(row.id, { [field.key]: value });
                        persist(row.id, { [field.key]: value });
                      }}
                    />
                  )
                )}
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-ash">
                  {savingIds.has(row.id) ? 'Saving…' : 'Saved'}
                </span>
                <button
                  onClick={() => handleDelete(row.id)}
                  className="cursor-target text-xs uppercase tracking-wide text-ash hover:text-core-ember transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: FieldConfig;
  value: any;
  onChange: (v: any) => void;
}) {
  const [local, setLocal] = useState(field.type === 'list' ? (value ?? []).join('\n') : value ?? '');

  useEffect(() => {
    setLocal(field.type === 'list' ? (value ?? []).join('\n') : value ?? '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const commit = () => {
    if (field.type === 'list') {
      onChange(local.split('\n').map((s: string) => s.trim()).filter(Boolean));
    } else if (field.type === 'number') {
      onChange(Number(local) || 0);
    } else {
      onChange(local);
    }
  };

  return (
    <div>
      <label className="text-xs uppercase tracking-wide text-ash">{field.label}</label>
      {field.type === 'textarea' || field.type === 'list' ? (
        <textarea
          value={local}
          onChange={(e) => setLocal(e.target.value)}
          onBlur={commit}
          rows={field.type === 'list' ? 4 : 3}
          placeholder={field.type === 'list' ? 'One item per line' : field.placeholder}
          className="cursor-target mt-1.5 w-full bg-obsidian border border-white/15 px-3 py-2 text-sm text-parchment focus:border-core-ember outline-none resize-none"
        />
      ) : field.type === 'select' ? (
        <select
          value={local}
          onChange={(e) => {
            setLocal(e.target.value);
            onChange(e.target.value);
          }}
          className="cursor-target mt-1.5 w-full bg-obsidian border border-white/15 px-3 py-2 text-sm text-parchment focus:border-core-ember outline-none"
        >
          {field.options?.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ) : (
        <input
          type={field.type === 'number' ? 'number' : field.type === 'color' ? 'color' : 'text'}
          value={local}
          onChange={(e) => setLocal(e.target.value)}
          onBlur={commit}
          placeholder={field.placeholder}
          className="cursor-target mt-1.5 w-full bg-obsidian border border-white/15 px-3 py-2 text-sm text-parchment focus:border-core-ember outline-none"
        />
      )}
    </div>
  );
}
