/** In-app domain events (typed discriminated union — see EventListenerService). */
export type CamelBirdAppEvent = DevblogAppEvent;

export type DevblogAppEvent = {
    readonly domain: "devblog";
    readonly type: "created";
};
