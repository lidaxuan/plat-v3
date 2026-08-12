/*<!--
 * @Description:
 * @Author: lidaxuan
 * @Date: 2026-08-11 18:12:24
 * @FilePath: src/application/lib.ts
 * @LastEditors: lijixuan
 * @LastEditTime: 2026-08-11 18:12:24
-->*/
const routers = [
  {
    path: '/test4',
    name: 'test4',
    meta: {fullScreen: true, keepAlive: true},
    component: () => import('../views/test4.vue'),
  },
]
let MoudleA = {
  routers: routers,
  // init(plat) {
  //   plat.addMoudleRoutes(routers);
  // }
};
function waitForEWebPlat(callback: (plat: typeof window.EWebPlat) => void, maxRetries = 10, interval = 100): void {
  let retries = 0;
  const check = () => {
    if (window.EWebPlat && window.EWebPlat.registerMoudle) {
      callback(window.EWebPlat);
    } else if (retries < maxRetries) {
      retries++;
      setTimeout(check, interval);
    } else {
      console.warn("EWebPlat not available after max retries");
    }
  };
  check();
}

waitForEWebPlat((plat) => {
  // plat.addMoudleService({ apiConfig: [] });
  plat.registerMoudle(MoudleA);
});
