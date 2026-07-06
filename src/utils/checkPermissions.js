import { useSelector } from "react-redux";

export const SCREEN_NAME_BY_PATH = {
    "/": "Welcome",
    "/home": "HomePage",
    "/login": "Welcome",
    "/Equipments": "Equipments",
    "/Calendar": "Calendar",
    "/Approvals": "approvals",
    "/StudentsData": "StudentsData",
    "/schedule": "schedule",
    "/WeeklyScheduleEditor": "WeeklyScheduleEditor",
    "/Kattendence": "Kattendence",
};

export const resolveScreenName = (value) => {
    if (!value) return "";
    if (SCREEN_NAME_BY_PATH[value]) return SCREEN_NAME_BY_PATH[value];

    if (String(value).startsWith("/Kattendence")) return "Kattendence";

    return String(value).replace(/^\/+/, "");
};

export const getPermissionForScreen = (permissions, screenOrPath) => {
    if (!screenOrPath) return false;

    const normalize = (value) =>
        String(value || "")
            .replace(/^\/+/, "")
            .toLowerCase();

    const resolvedScreen = resolveScreenName(screenOrPath);
    const normalizedScreen = normalize(resolvedScreen);

    console.log("screenName", screenOrPath, "resolved", resolvedScreen);

    const permis = (permissions || []).filter((p) => {
        const permName = p?.screenName ?? p?.screen_name ?? "";
        const normalizedPerm = normalize(permName);
        return (
            normalizedScreen === normalizedPerm ||
            normalizedScreen.startsWith(`${normalizedPerm}/`)
        );
    });

    if (permis.length === 0) return false;

    const canEdit = permis[0].canEdit ?? permis[0].can_edit;
    const canView = permis[0].canView ?? permis[0].can_view;

    if (canEdit) return "Edit";
    if (canView) return "View";

    return false;
};

export const useCheckPermission = () => {
    const user = useSelector((state) => state.user);
    const permissions = user?.userDetails?.permissions || user?.permissions || [];

    console.log(permissions, "permissions");

    return (screenOrPath) => getPermissionForScreen(permissions, screenOrPath);
};