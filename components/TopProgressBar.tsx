import Router from "next/router";
import NProgress from 'nprogress';
import { useEffect } from "react";

NProgress.configure({
  showSpinner: false,
  template: '<div class="bar" style="background-color: #ec1f24;" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
})

const TopProgressBar = () => {
  useEffect(() => {
    let timer: any;
    let state: string;
    let activeRequests = 0;
    const delay = 250;

    const load = () => {
      if (state === "loading") return;

      state = "loading";

      timer = setTimeout(() => {
        NProgress.start();
      }, delay);
    }

    const stop = () => {
      if (activeRequests > 0) return;
      state = "stop";

      clearTimeout(timer);
      NProgress.done();
    }

    Router.events.on("routeChangeStart", load);
    Router.events.on("routeChangeComplete", stop);
    Router.events.on("routeChangeError", stop);

    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      if (activeRequests === 0) {
        load();
      }

      activeRequests++;

      try {
        const response = await originalFetch(...args);
        return response;
      } catch (error) {
        return Promise.reject(error);
      } finally {
        activeRequests -= 1;
        if (activeRequests === 0) {
          stop();
        }
      }
    }
  }, []);

  return (<></>);
}

export default TopProgressBar;
