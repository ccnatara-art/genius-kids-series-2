export function createRouter(render) {
  let current = "home";
  return {
    go(route, payload = null) {
      current = route;
      render(route, payload);
    },
    current() {
      return current;
    }
  };
}
