const FORM_ELEMENT_NAMES = Object.freeze(['BUTTON', 'INPUT', 'TEXTAREA', 'SELECT']);

export function isFormElement({ tagName }: Pick<Element, 'tagName'>): boolean {
  const targetNodeName = tagName.toUpperCase();
  return FORM_ELEMENT_NAMES.includes(targetNodeName);
}
