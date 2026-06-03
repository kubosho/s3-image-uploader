/**
 * Stable identity key for a File.
 *
 * ark-ui FileUpload は同一 File を再投入しても別インスタンスになるため、
 * 参照ではなく name + lastModified + size で同一性を判定する。
 */
export const fileKey = (file: File): string => `${file.name}-${file.lastModified}-${file.size}`;
