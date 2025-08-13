import App from "./app";
export { App };
export { Form, FieldType } from "./views/form";
export { default as Menu } from "./views/menu";
export { default as Table } from "./views/table";
export { default as View } from "./views/view";
export { default as SelectView } from "./views/select-edit";
export { default as TextView } from "./views/text-edit";


declare global {
    interface Window {
        app: App;
    }
}