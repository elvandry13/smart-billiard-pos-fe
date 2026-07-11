export type FormValue = string | number | boolean | null | undefined | object;

export type FormPayload = Record<string, FormValue>;

export type CleanupOptions = {
  trimStrings?: boolean;
  convertEmptyToNull?: boolean;
  removeUndefined?: boolean;
  removeNull?: boolean;
  trimNullish?: boolean;
};

const defaultOptions: CleanupOptions = {
  trimStrings: true,
  convertEmptyToNull: false,
  removeUndefined: true,
  removeNull: false,
  trimNullish: false,
};

export function cleanFormPayload<T extends FormPayload>(
  payload: T,
  options: CleanupOptions = {}
): Partial<T> {
  const opts = { ...defaultOptions, ...options };
  const cleaned: Record<string, FormValue> = {};

  for (const [key, value] of Object.entries(payload)) {
    let processedValue: FormValue = value;

    if (typeof processedValue === 'string' && opts.trimStrings) {
      processedValue = processedValue.trim();
    }

    if (processedValue === '' && opts.convertEmptyToNull) {
      processedValue = null;
    }

    if (processedValue === undefined && opts.removeUndefined) {
      continue;
    }

    if (processedValue === null && opts.removeNull) {
      continue;
    }

    if ((processedValue === null || processedValue === undefined) && opts.trimNullish) {
      continue;
    }

    cleaned[key] = processedValue;
  }

  return cleaned as Partial<T>;
}

export function cleanFormData<T extends FormPayload>(payload: T): Partial<T> {
  return cleanFormPayload(payload, {
    trimStrings: true,
    convertEmptyToNull: true,
    removeUndefined: true,
  });
}

export function cleanApiPayload<T extends FormPayload>(payload: T): Partial<T> {
  return cleanFormPayload(payload, {
    trimStrings: true,
    convertEmptyToNull: false,
    removeUndefined: true,
    removeNull: false,
  });
}

export function removeEmptyFields<T extends FormPayload>(payload: T): Partial<T> {
  return cleanFormPayload(payload, {
    trimStrings: true,
    convertEmptyToNull: false,
    removeUndefined: true,
    removeNull: true,
    trimNullish: true,
  });
}

export function prepareCreatePayload<T extends FormPayload>(payload: T): Partial<T> {
  return cleanFormPayload(payload, {
    trimStrings: true,
    convertEmptyToNull: true,
    removeUndefined: true,
  });
}

export function prepareUpdatePayload<T extends FormPayload>(payload: T): Partial<T> {
  const cleaned = cleanFormPayload(payload, {
    trimStrings: true,
    convertEmptyToNull: false,
    removeUndefined: true,
    removeNull: false,
  });

  const result: Record<string, FormValue> = {};
  for (const [key, value] of Object.entries(cleaned)) {
    if (value !== undefined) {
      result[key] = value;
    }
  }

  return result as Partial<T>;
}
