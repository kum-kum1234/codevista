self.addEventListener(
  "push",
  (event) => {
    let payload = {
      title: "CodeVista",

      message:
        "You have a new notification.",

      link: "/",
    };


    if (event.data) {
      try {
        payload = {
          ...payload,

          ...event.data.json(),
        };
      } catch {
        payload.message =
          event.data.text();
      }
    }


    event.waitUntil(
      self.registration.showNotification(
        payload.title ||
          "CodeVista",

        {
          body:
            payload.message ||
            "You have a new notification.",

          icon: "/favicon.ico",

          badge: "/favicon.ico",

          data: {
            link:
              payload.link || "/",

            notificationId:
              payload.notificationId ||
              "",
          },
        }
      )
    );
  }
);


self.addEventListener(
  "notificationclick",
  (event) => {
    event.notification.close();


    const link =
      event.notification?.data?.link ||
      "/";


    event.waitUntil(
      self.clients
        .matchAll({
          type: "window",

          includeUncontrolled: true,
        })

        .then((clients) => {
          for (const client of clients) {
            if ("focus" in client) {
              client.navigate(link);

              return client.focus();
            }
          }


          if (self.clients.openWindow) {
            return self.clients.openWindow(
              link
            );
          }


          return null;
        })
    );
  }
);