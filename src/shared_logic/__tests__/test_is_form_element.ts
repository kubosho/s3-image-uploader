import { isFormElement } from '../is_form_element';

test('isFormElement(): return true', () => {
  const mockElements = [{ tagName: 'INPUT' }, { tagName: 'TEXTAREA' }, { tagName: 'SELECT' }];

  mockElements.forEach((e) => {
    const actual = isFormElement(e);
    expect(actual).toBe(true);
  });
});

test('isFormElement(): return false', () => {
  const mockElements = [{ tagName: 'DIV' }, { tagName: 'SPAN' }];

  mockElements.forEach((e) => {
    const actual = isFormElement(e);
    expect(actual).toBe(false);
  });
});
