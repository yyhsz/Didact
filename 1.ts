// const App = <div>...</div>
// React.render(App, document.getElementById('root'))
const TEXT_ELEMENT = 'TEXT_ELEMENT';
const isProp = (key) => key !== 'children';

type DidactElement = {
  type: string;
  props: Record<string, any> & { children?: any };
};

/** @jsx Didact.createElement */
const createElement = (
  type: string,
  props: Record<string, any>,
  ...children
) => {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) =>
        typeof child === 'object' ? child : createTextElement(child)
      ),
    },
  };
};
const createTextElement = (text: string) => {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      children: [],
    },
  };
};

const render = (ele: DidactElement, container: HTMLElement) => {
  const dom =
    ele.type === TEXT_ELEMENT
      ? document.createTextNode('')
      : document.createElement(ele.type);
  Object.keys(ele.props)
    .filter(isProp)
    .forEach((prop) => {
      dom[prop] = ele.props[prop];
    });

  ele.props.children?.forEach((child) => {
    render(child, dom as HTMLElement);
  });
  container.appendChild(dom);
};

const Didact = {
  render,
  createElement,
};
