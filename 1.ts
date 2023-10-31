// const App = <div>...</div>
// React.render(App, document.getElementById('root'))

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
  const dom = document.createElement(ele.type);
  ele.props.children?.forEach((child) => {
    render(child, dom);
  });
  container.appendChild(dom);
};

const Didact = {
  render,
  createElement,
};
