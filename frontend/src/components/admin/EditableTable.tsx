import React, { useState } from 'react';

export interface Column<T> {
  key: keyof T;
  label: string;
  editable?: boolean;
}

interface EditableTableProps<T extends { id: string }> {
  data: T[];
  columns: Column<T>[];
  onUpdate: (id: string, changes: Partial<T>) => Promise<void>;
  onDelete?: (id: string) => Promise<void> | void;
}

function EditableTable<T extends { id: string }>({ data, columns, onUpdate }: EditableTableProps<T>) {
  const [editingCell, setEditingCell] = useState<{ id: string; key: keyof T } | null>(null);
  const [changes, setChanges] = useState<Record<string, Partial<T>>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startEdit = (id: string, key: keyof T) => {
    setEditingCell({ id, key });
  };

  const finishEdit = (id: string, key: keyof T, value: any) => {
    setChanges((prev) => ({
      ...prev,
      [id]: { ...prev[id], [key]: value },
    }));
    setEditingCell(null);
  };

  const saveRow = async (id: string) => {
    const rowChanges = changes[id];
    if (!rowChanges) return;
    setSavingId(id);
    setError(null);
    try {
      await onUpdate(id, rowChanges);
      setChanges((prev) => {
        const newChanges = { ...prev };
        delete newChanges[id];
        return newChanges;
      });
    } catch (err) {
      setError('Failed to save');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-2">
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <table className="w-full text-sm text-left border">
        <thead>
          <tr className="border-b">
            {columns.map((col) => (
              <th key={String(col.key)} className="p-2">
                {col.label}
              </th>
            ))}
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="border-b">
              {columns.map((col) => {
                const value = (changes[row.id]?.[col.key] as any) ?? row[col.key];
                const isEditing = editingCell && editingCell.id === row.id && editingCell.key === col.key;
                return (
                  <td
                    key={String(col.key)}
                    className="p-2"
                    onDoubleClick={() => col.editable && startEdit(row.id, col.key)}
                  >
                    {isEditing ? (
                      <input
                        className="border p-1 w-full"
                        autoFocus
                        defaultValue={value as any}
                        onBlur={(e) => finishEdit(row.id, col.key, e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            (e.target as HTMLInputElement).blur();
                          }
                        }}
                      />
                    ) : (
                      String(value ?? '')
                    )}
                  </td>
                );
              })}
              <td className="p-2 space-x-2">
                <button
                  className="text-blue-600 disabled:text-gray-400"
                  disabled={!changes[row.id] || savingId === row.id}
                  onClick={() => saveRow(row.id)}
                >
                  {savingId === row.id ? 'Saving...' : 'Update'}
                </button>
                {onDelete && (
                  <button
                    className="text-red-600"
                    onClick={() => onDelete(row.id)}
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={columns.length + 1} className="p-2 text-center text-muted-foreground">
                No entries
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default EditableTable;
