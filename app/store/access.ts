/*
 * @Author: junsa junsa163@163.com
 * @Date: 2023-05-05 14:32:13
 * @LastEditors: junsa junsa163@163.com
 * @LastEditTime: 2023-05-05 18:57:34
 * @FilePath: /workerWebsite/githup/ChatGPT-Next-Web/app/store/access.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { StoreKey } from "../constant";
import { BOT_HELLO } from "./chat";

export function getEnvVar(varName: any) {
  // 如果在 Node.js 环境中，则从 process.env 中读取变量的值
  if (typeof process !== "undefined" && process.env && process.env[varName]) {
    return process.env[varName];
  }

  // 如果在浏览器环境中，则从 window 对象中读取变量的值
  if (typeof window !== "undefined" && window[varName]) {
    return window[varName];
  }

  // 如果未定义该变量，则返回 undefined
  return undefined;
}

export interface AccessControlStore {
  accessCode: string;
  token: any;

  needCode: boolean;
  hideUserApiKey: boolean;
  openaiUrl: string;

  updateToken: (_: string) => void;
  updateCode: (_: string) => void;
  enabledAccessControl: () => boolean;
  isAuthorized: () => boolean;
  fetch: () => void;
}

let fetchState = 0; // 0 not fetch, 1 fetching, 2 done

export const useAccessStore = create<AccessControlStore>()(
  persist(
    (set, get) => ({
      token: getEnvVar("OPENAI_API_KEY"),
      accessCode: "",
      needCode: true,
      hideUserApiKey: true, //false,
      openaiUrl: "/api/openai/",

      enabledAccessControl() {
        get().fetch();

        return get().needCode;
      },
      updateCode(code: string) {
        set(() => ({ accessCode: code }));
      },
      updateToken(token: string) {
        set(() => ({ token }));
      },
      isAuthorized() {
        // has token or has code or disabled access contro
        return (
          !!get().token || !!get().accessCode || !get().enabledAccessControl()
        );
      },
      fetch() {
        if (fetchState > 0) return;
        fetchState = 1;
        fetch("/api/config", {
          method: "post",
          body: null,
        })
          .then((res) => res.json())
          .then((res: DangerConfig) => {
            console.log("[Config] got config from server", res);
            set(() => ({ ...res }));

            if ((res as any).botHello) {
              BOT_HELLO.content = (res as any).botHello;
            }
          })
          .catch(() => {
            console.error("[Config] failed to fetch config");
          })
          .finally(() => {
            fetchState = 2;
          });
      },
    }),
    {
      name: StoreKey.Access,
      version: 1,
    },
  ),
);
