/**
 * @jest-environment jsdom
 */
// src/js/cart.test.js

describe('cart.js renderCartContents', () => {
  const cartModulePath = './cart.js';

  beforeEach(() => {
    jest.resetModules();
    document.body.innerHTML = '<ul class="product-list"></ul>';
  });

  afterEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = '';
  });

  test('does not throw and leaves product-list empty when getLocalStorage returns null', () => {
    const mockGetLocalStorage = jest.fn().mockReturnValue(null);
    jest.doMock('./utils.mjs', () => ({ getLocalStorage: mockGetLocalStorage }));

    jest.isolateModules(() => {
      expect(() => {
        require(cartModulePath);
      }).not.toThrow();
    });

    const list = document.querySelector('.product-list');
    expect(list).not.toBeNull();
    expect(list.innerHTML).toBe('');
  });

  test('renders a single cart item when getLocalStorage returns one item', () => {
    const sampleItem = {
      Image: 'http://example.com/img.jpg',
      Name: 'Sample Tent',
      Colors: [{ ColorName: 'Green' }],
      FinalPrice: 199.99,
    };

    const mockGetLocalStorage = jest.fn().mockReturnValue([sampleItem]);
    jest.doMock('./utils.mjs', () => ({ getLocalStorage: mockGetLocalStorage }));

    jest.isolateModules(() => {
      require(cartModulePath);
    });

    const list = document.querySelector('.product-list');
    expect(list).not.toBeNull();
    const html = list.innerHTML;
    expect(html).toContain(sampleItem.Name);
    expect(html).toContain(String(sampleItem.FinalPrice));
    expect(html).toContain(sampleItem.Image);
    expect(html).toContain('qty: 1');
    expect(html).toContain(sampleItem.Colors[0].ColorName);
  });

  test('renders multiple cart items when getLocalStorage returns multiple items', () => {
    const items = [
      {
        Image: 'http://example.com/img1.jpg',
        Name: 'Tent One',
        Colors: [{ ColorName: 'Blue' }],
        FinalPrice: 99.99,
      },
      {
        Image: 'http://example.com/img2.jpg',
        Name: 'Tent Two',
        Colors: [{ ColorName: 'Red' }],
        FinalPrice: 149.99,
      },
    ];

    const mockGetLocalStorage = jest.fn().mockReturnValue(items);
    jest.doMock('./utils.mjs', () => ({ getLocalStorage: mockGetLocalStorage }));

    jest.isolateModules(() => {
      require(cartModulePath);
    });

    const list = document.querySelector('.product-list');
    expect(list).not.toBeNull();
    const html = list.innerHTML;
    items.forEach(item => {
      expect(html).toContain(item.Name);
      expect(html).toContain(String(item.FinalPrice));
      expect(html).toContain(item.Image);
      expect(html).toContain('qty: 1');
      expect(html).toContain(item.Colors[0].ColorName);
    });
  });
});