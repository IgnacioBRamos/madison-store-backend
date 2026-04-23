import { AppRoutes } from "./presentation/routes.js";
import { Server } from "./presentation/server.js";



(() => {
    main();
})();


function main() {
    const server = new Server(AppRoutes.routes)


    server.start()
}