import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUsersThunk } from '../redux/slices/USERS/getUsersThunk';
import { updateUserThunk } from '../redux/slices/USERS/updateUserThunk';
import { addUserThunk } from '../redux/slices/USERS/addUserThunk';
import { deleteUserThunk } from '../redux/slices/USERS/deleteUserThunk';
import { getRolesThunk } from '../redux/slices/ROLES/getRolesThunk';
import { getPermissionsThunk } from '../redux/slices/PERMISSIONS/getPermissionsThunk';
import { getRolePermissionsThunk } from '../redux/slices/ROLE_PERMISSIONS/getRolePermissionsThunk';
import { addRoleThunk } from '../redux/slices/ROLES/addRoleThunk';
import { updateRoleThunk } from '../redux/slices/ROLES/updateRoleThunk';
import { deleteRoleThunk } from '../redux/slices/ROLES/deleteRoleThunk';
import { updatePermissionThunk } from '../redux/slices/PERMISSIONS/updatePermissionThunk';
import { addRolePermissionThunk } from '../redux/slices/ROLE_PERMISSIONS/addRolePermissionThunk';
import { updateRolePermissionThunk } from '../redux/slices/ROLE_PERMISSIONS/updateRolePermissionThunk';

const Managment = () => {
  const dispatch = useDispatch();
  const { users, loading: usersLoading } = useSelector((state) => state.users);
  const { roles, loading: rolesLoading } = useSelector((state) => state.roles);
  const { permissions } = useSelector((state) => state.permissions);
  const { rolePermissions } = useSelector((state) => state.rolePermissions);
  const currentUser = useSelector((state) => state.user);

  const [selectedSection, setSelectedSection] = useState('users');
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedRoleForEdit, setSelectedRoleForEdit] = useState(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [showEditRolePermissionsModal, setShowEditRolePermissionsModal] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    institution_code: currentUser.institution_code,
    role_id: '',
    active: true
  });
  const [newRole, setNewRole] = useState({
    name: '',
    description: '',
    institution_code: currentUser.institution_code
  });

  useEffect(() => {
    dispatch(getUsersThunk());
    dispatch(getRolesThunk());
    dispatch(getPermissionsThunk());
    dispatch(getRolePermissionsThunk());
  }, [dispatch]);

  const handleUpdateUserRole = async (userId, newRoleId) => {
    try {
      await dispatch(updateUserThunk({
        id: userId,
        userData: { role_id: newRoleId }
      })).unwrap();
      alert('התפקיד עודכן בהצלחה');
    } catch (error) {
      alert('שגיאה בעדכון התפקיד');
      console.error(error);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await dispatch(addUserThunk(newUser)).unwrap();
      alert('המשתמש נוסף בהצלחה');
      setShowAddUserModal(false);
      setNewUser({
        name: '',
        email: '',
        password: '',
        institution_code: currentUser.institution_code,
        role_id: '',
        active: true
      });
    } catch (error) {
      alert('שגיאה בהוספת המשתמש');
      console.error(error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק משתמש זה?')) {
      try {
        await dispatch(deleteUserThunk(userId)).unwrap();
        alert('המשתמש נמחק בהצלחה');
      } catch (error) {
        alert('שגיאה במחיקת המשתמש');
        console.error(error);
      }
    }
  };

  const handleToggleUserActive = async (userId, currentActive) => {
    try {
      await dispatch(updateUserThunk({
        id: userId,
        userData: { active: !currentActive }
      })).unwrap();
      alert('הסטטוס עודכן בהצלחה');
    } catch (error) {
      alert('שגיאה בעדכון הסטטוס');
      console.error(error);
    }
  };

  const getRolePermissionsForRole = (roleId) => {
    return rolePermissions.filter(rp => rp.role_id === roleId);
  };

  const getPermissionDetails = (permissionId) => {
    return permissions.find(p => p.id === permissionId);
  };

  const getRoleName = (roleId) => {
    const role = roles.find(r => r.id === roleId);
    return role ? role.name : 'לא מוגדר';
  };

  const viewRolePermissions = (role) => {
    setSelectedRole(role);
    setShowPermissionsModal(true);
  };

  const handleAddRole = async (e) => {
    e.preventDefault();
    try {
      await dispatch(addRoleThunk(newRole)).unwrap();
      alert('התפקיד נוסף בהצלחה');
      setShowAddRoleModal(false);
      setNewRole({
        name: '',
        description: '',
        institution_code: currentUser.institution_code
      });
    } catch (error) {
      alert('שגיאה בהוספת התפקיד');
      console.error(error);
    }
  };

  const handleDeleteRole = async (roleId) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק תפקיד זה?')) {
      try {
        await dispatch(deleteRoleThunk(roleId)).unwrap();
        alert('התפקיד נמחק בהצלחה');
      } catch (error) {
        alert('שגיאה במחיקת התפקיד');
        console.error(error);
      }
    }
  };

  const handleEditRolePermissions = (role) => {
    setSelectedRoleForEdit(role);
    setShowEditRolePermissionsModal(true);
  };

  const handleTogglePermission = async (permission, field) => {
    if (!selectedRoleForEdit) return;

    try {
      const existingRolePermission = rolePermissions.find(
        rp => rp.role_id === selectedRoleForEdit.id && rp.permission_id === permission.id
      );

      if (existingRolePermission) {
        // Update existing role permission
        const newValue = field === 'can_view' 
          ? !existingRolePermission.can_view 
          : !existingRolePermission.can_edit;

        await dispatch(updateRolePermissionThunk({
          roleId: selectedRoleForEdit.id,
          permissionId: permission.id,
          rolePermissionData: {
            ...existingRolePermission,
            [field]: newValue
          }
        })).unwrap();
      } else {
        // Create new role permission
        await dispatch(addRolePermissionThunk({
          role_id: selectedRoleForEdit.id,
          permission_id: permission.id,
          can_view: field === 'can_view' ? true : false,
          can_edit: field === 'can_edit' ? true : false
        })).unwrap();
      }
      
      // Refresh role permissions
      await dispatch(getRolePermissionsThunk());
    } catch (error) {
      alert('שגיאה בעדכון ההרשאה');
      console.error(error);
    }
  };

  const getRolePermissionForPermission = (roleId, permissionId) => {
    return rolePermissions.find(
      rp => rp.role_id === roleId && rp.permission_id === permissionId
    );
  };

  if (usersLoading || rolesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-700">טוען נתונים...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">ניהול מערכת</h1>
          <p className="text-gray-600">קוד מוסד: {currentUser.institution_code}</p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-lg mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setSelectedSection('users')}
              className={`px-6 py-4 font-semibold transition-colors ${
                selectedSection === 'users'
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-gray-600 hover:text-indigo-600'
              }`}
            >
              ניהול משתמשים
            </button>
            <button
              onClick={() => setSelectedSection('roles')}
              className={`px-6 py-4 font-semibold transition-colors ${
                selectedSection === 'roles'
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-gray-600 hover:text-indigo-600'
              }`}
            >
              ניהול תפקידים
            </button>
          </div>
        </div>

        {/* Users Management Section */}
        {selectedSection === 'users' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">רשימת משתמשים</h2>
              <button
                onClick={() => setShowAddUserModal(true)}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
              >
                + הוסף משתמש חדש
              </button>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      שם
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      אימייל
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      תפקיד נוכחי
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      עדכן תפקיד
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      סטטוס
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      פעולות
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                          {getRoleName(user.role_id)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={user.role_id}
                          onChange={(e) => handleUpdateUserRole(user.id, parseInt(e.target.value))}
                          className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="">בחר תפקיד</option>
                          {roles.map((role) => (
                            <option key={role.id} value={role.id}>
                              {role.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleUserActive(user.id, user.active)}
                          className={`px-3 py-1 text-xs rounded-full ${
                            user.active
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                        >
                          {user.active ? 'פעיל' : 'לא פעיל'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => {
                            const role = roles.find(r => r.id === user.role_id);
                            if (role) viewRolePermissions(role);
                          }}
                          className="text-indigo-600 hover:text-indigo-900 ml-3"
                        >
                          צפה בהרשאות
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          מחק
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add User Modal */}
        {showAddUserModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" dir="rtl">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">הוסף משתמש חדש</h3>
                <form onSubmit={handleAddUser}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">שם</label>
                    <input
                      type="text"
                      required
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">אימייל</label>
                    <input
                      type="email"
                      required
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">סיסמה</label>
                    <input
                      type="password"
                      required
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">תפקיד</label>
                    <select
                      required
                      value={newUser.role_id}
                      onChange={(e) => setNewUser({ ...newUser, role_id: parseInt(e.target.value) })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">בחר תפקיד</option>
                      {roles.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setShowAddUserModal(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                    >
                      ביטול
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                    >
                      הוסף
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Roles Management Section */}
        {selectedSection === 'roles' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">רשימת תפקידים</h2>
              <button
                onClick={() => setShowAddRoleModal(true)}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
              >
                + הוסף תפקיד חדש
              </button>
            </div>

            {/* Roles Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      שם התפקיד
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      תיאור
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      פעולות
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {roles.map((role) => (
                    <tr key={role.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{role.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">{role.description || 'אין תיאור'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleEditRolePermissions(role)}
                          className="text-indigo-600 hover:text-indigo-900 ml-4 font-medium"
                        >
                          ערוך הרשאות
                        </button>
                        <button
                          onClick={() => viewRolePermissions(role)}
                          className="text-blue-600 hover:text-blue-900 ml-4"
                        >
                          צפה בהרשאות
                        </button>
                        <button
                          onClick={() => handleDeleteRole(role.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          מחק
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add Role Modal */}
        {showAddRoleModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" dir="rtl">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">הוסף תפקיד חדש</h3>
                <form onSubmit={handleAddRole}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">שם התפקיד</label>
                    <input
                      type="text"
                      required
                      value={newRole.name}
                      onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">תיאור</label>
                    <textarea
                      value={newRole.description}
                      onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      rows="3"
                    />
                  </div>
                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setShowAddRoleModal(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                    >
                      ביטול
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                    >
                      הוסף
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Edit Role Permissions Modal */}
        {showEditRolePermissionsModal && selectedRoleForEdit && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" dir="rtl">
            <div className="relative top-10 mx-auto p-5 border w-4/5 max-w-4xl shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  עריכת הרשאות לתפקיד: {selectedRoleForEdit.name}
                </h3>
                <div className="overflow-x-auto max-h-[70vh] overflow-y-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                          מסך
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                          צפיה
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                          עריכה
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {permissions.map((permission) => {
                        const rolePermission = getRolePermissionForPermission(
                          selectedRoleForEdit.id,
                          permission.id
                        );
                        const canView = rolePermission?.can_view || false;
                        const canEdit = rolePermission?.can_edit || false;

                        return (
                          <tr key={permission.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {permission.screen_name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <input
                                type="checkbox"
                                checked={canView}
                                onChange={() => handleTogglePermission(permission, 'can_view')}
                                className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <input
                                type="checkbox"
                                checked={canEdit}
                                onChange={() => handleTogglePermission(permission, 'can_edit')}
                                className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => setShowEditRolePermissionsModal(false)}
                    className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                  >
                    סגור
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Permissions Modal */}
        {showPermissionsModal && selectedRole && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" dir="rtl">
            <div className="relative top-20 mx-auto p-5 border w-2/3 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  הרשאות לתפקיד: {selectedRole.name}
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                          מסך
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                          צפיה
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                          עריכה
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {getRolePermissionsForRole(selectedRole.id).map((rp) => {
                        const permission = getPermissionDetails(rp.permission_id);
                        return permission ? (
                          <tr key={rp.permission_id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {permission.screen_name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              {permission.can_view ? (
                                <span className="text-green-600 text-xl">✓</span>
                              ) : (
                                <span className="text-red-600 text-xl">✗</span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              {permission.can_edit ? (
                                <span className="text-green-600 text-xl">✓</span>
                              ) : (
                                <span className="text-red-600 text-xl">✗</span>
                              )}
                            </td>
                          </tr>
                        ) : null;
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => setShowPermissionsModal(false)}
                    className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                  >
                    סגור
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Managment;
