# מערכת ניהול משתמשים - תיעוד מלא

## סקירה כללית
נוצר דף ניהול מערכת מלא עם ניהול משתמשים, תפקידים, הרשאות, והקשר ביניהם.

## מבנה הטבלאות

### 1. users (משתמשים)
- id: מזהה ייחודי
- name: שם המשתמש
- email: כתובת אימייל
- password_hash: סיסמה מוצפנת
- institution_code: קוד מוסד
- role_id: מזהה תפקיד (קישור ל-roles)
- created_at: תאריך יצירה
- active: סטטוס פעיל/לא פעיל

### 2. roles (תפקידים)
- id: מזהה ייחודי
- name: שם התפקיד (למשל: admin, teacher, secretary, viewer)

### 3. permissions (הרשאות)
- id: מזהה ייחודי
- screen_name: שם המסך
- can_view: האם ניתן לצפות
- can_edit: האם ניתן לעדכן

### 4. role_permissions (קשר בין תפקידים להרשאות)
- role_id: מזהה תפקיד
- permission_id: מזהה הרשאה

## קבצים שנוצרו

### Redux Slices - USERS
1. `src/redux/slices/USERS/usersSlice.js` - סלייס ראשי
2. `src/redux/slices/USERS/getUsersThunk.js` - קבלת כל המשתמשים
3. `src/redux/slices/USERS/getUserByIdThunk.js` - קבלת משתמש לפי ID
4. `src/redux/slices/USERS/addUserThunk.js` - הוספת משתמש חדש
5. `src/redux/slices/USERS/updateUserThunk.js` - עדכון משתמש
6. `src/redux/slices/USERS/deleteUserThunk.js` - מחיקת משתמש

### Redux Slices - ROLES
1. `src/redux/slices/ROLES/rolesSlice.js` - סלייס ראשי
2. `src/redux/slices/ROLES/getRolesThunk.js` - קבלת כל התפקידים
3. `src/redux/slices/ROLES/getRoleByIdThunk.js` - קבלת תפקיד לפי ID
4. `src/redux/slices/ROLES/addRoleThunk.js` - הוספת תפקיד חדש
5. `src/redux/slices/ROLES/updateRoleThunk.js` - עדכון תפקיד
6. `src/redux/slices/ROLES/deleteRoleThunk.js` - מחיקת תפקיד

### Redux Slices - PERMISSIONS
1. `src/redux/slices/PERMISSIONS/permissionsSlice.js` - סלייס ראשי
2. `src/redux/slices/PERMISSIONS/getPermissionsThunk.js` - קבלת כל ההרשאות
3. `src/redux/slices/PERMISSIONS/getPermissionByIdThunk.js` - קבלת הרשאה לפי ID
4. `src/redux/slices/PERMISSIONS/addPermissionThunk.js` - הוספת הרשאה חדשה
5. `src/redux/slices/PERMISSIONS/updatePermissionThunk.js` - עדכון הרשאה
6. `src/redux/slices/PERMISSIONS/deletePermissionThunk.js` - מחיקת הרשאה

### Redux Slices - ROLE_PERMISSIONS
1. `src/redux/slices/ROLE_PERMISSIONS/rolePermissionsSlice.js` - סלייס ראשי
2. `src/redux/slices/ROLE_PERMISSIONS/getRolePermissionsThunk.js` - קבלת כל הקשרים
3. `src/redux/slices/ROLE_PERMISSIONS/getRolePermissionByIdThunk.js` - קבלת קשר לפי ID
4. `src/redux/slices/ROLE_PERMISSIONS/addRolePermissionThunk.js` - הוספת קשר חדש
5. `src/redux/slices/ROLE_PERMISSIONS/updateRolePermissionThunk.js` - עדכון קשר
6. `src/redux/slices/ROLE_PERMISSIONS/deleteRolePermissionThunk.js` - מחיקת קשר

### דף הניהול
- `src/pages/Managment.jsx` - דף ניהול המערכת המלא

### עדכון Store
- `src/redux/store.js` - עודכן עם כל הסלייסים החדשים

## תכונות דף הניהול

### 1. רשימת משתמשים
- הצגת כל המשתמשים של המוסד
- הצגת פרטי כל משתמש: שם, אימייל, תפקיד, סטטוס
- טבלה מעוצבת ונוחה לשימוש

### 2. עדכון תפקידים
- תפריט נפתח לבחירת תפקיד חדש לכל משתמש
- עדכון מיידי בלחיצת כפתור
- הצגת התפקיד הנוכחי בתג צבעוני

### 3. הוספת משתמש חדש
- כפתור להוספת משתמש חדש
- חלון קופץ (Modal) עם טופס מלא
- שדות: שם, אימייל, סיסמה, בחירת תפקיד
- ולידציה של שדות חובה

### 4. צפייה בהרשאות
- כפתור "צפה בהרשאות" לכל משתמש
- חלון קופץ מפורט המציג את ההרשאות לפי תפקיד
- טבלה המציגה לכל מסך: אפשרות צפיה ואפשרות עריכה
- סימונים ויזואליים (✓/✗) להרשאות

### 5. ניהול סטטוס משתמש
- כפתור לשינוי סטטוס פעיל/לא פעיל
- צבע ירוק לפעיל, אדום ללא פעיל
- עדכון מיידי

### 6. מחיקת משתמש
- כפתור מחיקה לכל משתמש
- הודעת אישור לפני מחיקה
- מחיקה מיידית מהרשימה

## API Endpoints המשמשים

### Users
- GET `/api/users` - קבלת כל המשתמשים
- GET `/api/users/{id}` - קבלת משתמש ספציפי
- POST `/api/users` - הוספת משתמש חדש
- PUT `/api/users/{id}` - עדכון משתמש
- DELETE `/api/users/{id}` - מחיקת משתמש

### Roles
- GET `/api/roles` - קבלת כל התפקידים
- GET `/api/roles/{id}` - קבלת תפקיד ספציפי
- POST `/api/roles` - הוספת תפקיד חדש
- PUT `/api/roles/{id}` - עדכון תפקיד
- DELETE `/api/roles/{id}` - מחיקת תפקיד

### Permissions
- GET `/api/permissions` - קבלת כל ההרשאות
- GET `/api/permissions/{id}` - קבלת הרשאה ספציפית
- POST `/api/permissions` - הוספת הרשאה חדשה
- PUT `/api/permissions/{id}` - עדכון הרשאה
- DELETE `/api/permissions/{id}` - מחיקת הרשאה

### RolePermissions
- GET `/api/role-permissions` - קבלת כל הקשרים
- GET `/api/role-permissions/{roleId}/{permissionId}` - קבלת קשר ספציפי
- POST `/api/role-permissions` - הוספת קשר חדש
- PUT `/api/role-permissions/{roleId}/{permissionId}` - עדכון קשר
- DELETE `/api/role-permissions/{roleId}/{permissionId}` - מחיקת קשר

## עיצוב ו-UI

### צבעים ונושא
- רקע: גרדיאנט כחול-אינדיגו
- כרטיסים: לבן עם צללים
- כפתור ראשי: אינדיגו (#4F46E5)
- מצבי הצלחה: ירוק
- מצבי שגיאה: אדום

### רספונסיביות
- תמיכה מלאה במסכים שונים
- טבלאות עם גלילה אופקית
- מודלים ממורכזים
- כיוון RTL מלא

### אינטראקציות
- אנימציות על מעבר עכבר
- הודעות משוב למשתמש
- מצב טעינה עם ספינר מונפש
- אישור לפני פעולות מסוכנות

## שימוש בקוד

### דוגמה לעדכון תפקיד משתמש:
```javascript
await dispatch(updateUserThunk({
  id: userId,
  userData: { role_id: newRoleId }
})).unwrap();
```

### דוגמה להוספת משתמש חדש:
```javascript
await dispatch(addUserThunk({
  name: 'שם משתמש',
  email: 'user@example.com',
  password: 'password123',
  institution_code: 'INST001',
  role_id: 1,
  active: true
})).unwrap();
```

### דוגמה לקבלת הרשאות לפי תפקיד:
```javascript
const rolePermissions = useSelector((state) => 
  state.rolePermissions.rolePermissions.filter(rp => rp.role_id === roleId)
);
```

## הערות חשובות

1. כל הקריאות ל-API משתמשות במשתנה סביבה `VITE_BACKEND_URL`
2. המערכת מסננת משתמשים לפי `institution_code` של המשתמש המחובר
3. יש טיפול מלא בשגיאות עם הודעות למשתמש
4. המערכת משתמשת ב-Redux Toolkit עם `createAsyncThunk`
5. כל הפעולות אסינכרוניות עם `async/await`

## הרחבות עתידיות אפשריות

1. ניהול תפקידים - הוספה, עריכה, מחיקה
2. ניהול הרשאות - הוספה, עריכה, מחיקה
3. עריכת הרשאות לתפקיד - שינוי הרשאות ספציפיות
4. חיפוש וסינון משתמשים
5. מיון לפי עמודות
6. ייצוא לאקסל
7. היסטוריית שינויים
8. הרשאות מתקדמות (לא רק צפיה/עריכה)
