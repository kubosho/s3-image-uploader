import { fromEvent, Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { isFormElement } from '../is_form_element';
import { IndexPageShortcutKey, indexPageShortcutKeys } from './shortcut_keys';

export const keyboardEventOnIndexPageObservable = (
  observableArg?: Observable<KeyboardEvent>,
): Observable<IndexPageShortcutKey> | null => {
  if (typeof document === 'undefined') {
    return null;
  }

  const doc = document && document.documentElement;

  const observable = observableArg ?? fromEvent<KeyboardEvent>(doc, 'keydown');
  const keyboardEventObservable = observable.pipe(
    filter(
      (event) =>
        !isFormElement(event.target as Element) &&
        !isPressedModifierKey(event) &&
        isTargetToIndexPageShortcut(event.key),
    ),
    tap((event) => event.preventDefault()),
    map(({ key }) => key as IndexPageShortcutKey),
  );

  return keyboardEventObservable;
};

function isPressedModifierKey(event: KeyboardEvent): boolean {
  const { altKey, ctrlKey, metaKey } = event;
  return altKey || ctrlKey || metaKey;
}

function isTargetToIndexPageShortcut(key: string): boolean {
  return indexPageShortcutKeys.includes(key as IndexPageShortcutKey);
}
