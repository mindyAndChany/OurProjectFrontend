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
import { deleteRolePermissionThunk } from '../redux/slices/ROLE_PERMISSIONS/deleteRolePermissionThunk';
import { getRoomsThunk } from '../redux/slices/ROOMS/getRoomsThunk';
import { addRoomThunk } from '../redux/slices/ROOMS/addRoomThunk';
import { updateRoomThunk } from '../redux/slices/ROOMS/updateRoomThunk';
import { deleteRoomThunk } from '../redux/slices/ROOMS/deleteRoomThunk';

const Managment = () => {
  const dispatch = useDispatch();
  const { users, loading: usersLoading } = useSelector((state) => state.users);
  const { roles, loading: rolesLoading } = useSelector((state) => state.roles);
  const { permissions } = useSelector((state) => state.permissions);
  const { rolePermissions } = useSelector((state) => state.rolePermissions);
  const { data: rooms } = useSelector((state) => state.rooms);
  const currentUser = useSelector((state) => state.user);

  const [selectedSection, setSelectedSection] = useState('users');
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedRoleForEdit, setSelectedRoleForEdit] = useState(null);
  const [permissionsUpdateKey, setPermissionsUpdateKey] = useState(0);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [showEditRolePermissionsModal, setShowEditRolePermissionsModal] = useState(false);
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [showEditRoomModal, setShowEditRoomModal] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editingRoom, setEditingRoom] = useState(null);
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
  const [newRoom, setNewRoom] = useState({
    name: '',
    number: '',
    is_computer_lab: false,
    has_makren: false,
    floor: 0,
    seat_count: 0,
    is_available: true,
    primary_use: ''
  });

  useEffect(() => {
    dispatch(getUsersThunk());
    dispatch(getRolesThunk());
    dispatch(getPermissionsThunk());
    dispatch(getRolePermissionsThunk());
    dispatch(getRoomsThunk());
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
    dispatch(getRolePermissionsThunk());
  };

  const handleTogglePermission = async (permission, field) => {
    if (!selectedRoleForEdit) return;

    try {
      const existingRolePermission = rolePermissions.find(
        rp => rp.role_id === selectedRoleForEdit.id && rp.permission_id === permission.id
      );

      console.log('🔍 handleTogglePermission called:', {
        permissionId: permission.id,
        field,
        existingRolePermission,
        currentValues: existingRolePermission?.permission
      });

      if (existingRolePermission) {
        const currentCanView = existingRolePermission.permission?.can_view ?? false;
        const currentCanEdit = existingRolePermission.permission?.can_edit ?? false;
        
        const newCanView = field === 'can_view' ? !currentCanView : currentCanView;
        const newCanEdit = field === 'can_edit' ? !currentCanEdit : currentCanEdit;
        
        console.log('📝 Updating permission:', {
          current: { can_view: currentCanView, can_edit: currentCanEdit },
          new: { can_view: newCanView, can_edit: newCanEdit }
        });
        
        // אם שני השדות false, מוחקים את ההרשאה
        if (!newCanView && !newCanEdit) {
          await dispatch(deleteRolePermissionThunk({
            roleId: selectedRoleForEdit.id,
            permissionId: permission.id
          })).unwrap();
        } else {
          await dispatch(updateRolePermissionThunk({
            roleId: selectedRoleForEdit.id,
            permissionId: permission.id,
            rolePermissionData: {
              can_view: newCanView,
              can_edit: newCanEdit
            }
          })).unwrap();
        }
      } else {
        console.log('➕ Adding new permission');
        await dispatch(addRolePermissionThunk({
          role_id: selectedRoleForEdit.id,
          permission_id: permission.id,
          can_view: field === 'can_view',
          can_edit: field === 'can_edit'
        })).unwrap();
      }
      
      // רענון נתוני ההרשאות מהשרת
      await dispatch(getRolePermissionsThunk()).unwrap();
      
      // עדכון ה-key כדי לגרום לטבלה להתרענן
      setPermissionsUpdateKey(prev => prev + 1);
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

  const getHebrewScreenName = (screenName) => {
    const hebrewNames = {
      'home': 'דף הבית',
      'homepage': 'דף הבית',
      'studentsdata': 'נתוני תלמידות',
      'students': 'נתוני תלמידות',
      'kattendence': 'נוכחות',
      'attendance': 'נוכחות',
      'calendar': 'לוח שנה',
      'equipments': 'השאלת ציוד',
      'approvals': 'אישורים',
      'WeeklyScheduleEditor':'ניהול מערכת',
      'schedule': 'מערכת',
      'management': 'ניהול',
      'managment': 'ניהול',
      
    };
    return hebrewNames[screenName?.toLowerCase()] || screenName;
  };

  // Room Management Functions
  const handleAddRoom = async (e) => {
    e.preventDefault();
    try {
      await dispatch(addRoomThunk(newRoom)).unwrap();
      alert('החדר נוסף בהצלחה');
      setShowAddRoomModal(false);
      setNewRoom({
        name: '',
        number: '',
        is_computer_lab: false,
        has_makren: false,
        floor: 0,
        seat_count: 0,
        is_available: true,
        primary_use: ''
      });
    } catch (error) {
      alert('שגיאה בהוספת החדר');
      console.error(error);
    }
  };

  const handleEditRoom = (room) => {
    setEditingRoom(room);
    setShowEditRoomModal(true);
  };

  const handleUpdateRoom = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateRoomThunk({
        id: editingRoom.id,
        roomData: editingRoom
      })).unwrap();
      alert('החדר עודכן בהצלחה');
      setShowEditRoomModal(false);
      setEditingRoom(null);
    } catch (error) {
      alert('שגיאה בעדכון החדר');
      console.error(error);
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק חדר זה?')) {
      try {
        await dispatch(deleteRoomThunk(roomId)).unwrap();
        alert('החדר נמחק בהצלחה');
      } catch (error) {
        alert('שגיאה במחיקת החדר');
        console.error(error);
      }
    }
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
            <button
              onClick={() => setSelectedSection('rooms')}
              className={`px-6 py-4 font-semibold transition-colors ${
                selectedSection === 'rooms'
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-gray-600 hover:text-indigo-600'
              }`}
            >
              ניהול חדרים
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

        {/* Rooms Management Section */}
        {selectedSection === 'rooms' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">מפת חדרים סמינר בית יעקוב גור ירושלים</h2>
              <button
                onClick={() => setShowAddRoomModal(true)}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
              >
                + הוסף חדר חדש
              </button>
            </div>

            {/* Rooms Map by Floor */}
            <div className="space-y-6">
              {[...new Set(rooms?.map(r => r.floor) || [])].sort((a, b) => b - a).map(floor => {
                const floorRooms = rooms?.filter(r => r.floor === floor) || [];
                
                // חדרים מרכזיים (מסתיימים ב-00)
                const centerRooms = floorRooms.filter(r => r.number.endsWith('00'))
                  .sort((a, b) => parseInt(b.number) - parseInt(a.number));
                
                // חלוקה לזוגי ואי-זוגי (ללא המרכזיים)
                const evenRooms = floorRooms.filter(r => !r.number.endsWith('00') && parseInt(r.number) % 2 === 0)
                  .sort((a, b) => parseInt(b.number) - parseInt(a.number));
                const oddRooms = floorRooms.filter(r => !r.number.endsWith('00') && parseInt(r.number) % 2 !== 0)
                  .sort((a, b) => parseInt(b.number) - parseInt(a.number));

                const maxRows = Math.max(evenRooms.length, oddRooms.length, centerRooms.length);

                return (
                  <div key={floor} className="border-2 border-gray-300 rounded-lg overflow-hidden">
                    {/* Floor Header */}
                    <div className="bg-indigo-600 text-white px-4 py-3 text-center">
                      <h3 className="text-xl font-bold">קומה {floor}</h3>
                    </div>

                    {/* Three Column Layout */}
                    <div className="grid grid-cols-3 gap-0">
                      {/* Right Side Table - Even Numbers */}
                      <div className="border-l border-gray-300">
                        <table className="min-w-full border-collapse">
                          <thead className="bg-indigo-50">
                            <tr>
                              <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-indigo-900">מס' חדר</th>
                              <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-indigo-900">מקום</th>
                              <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-indigo-900">שיבוץ</th>
                              <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-indigo-900">מס' מקומות</th>
                              <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-indigo-900">פעולות</th>
                            </tr>
                          </thead>
                          <tbody>
                            {evenRooms.map((room, index) => (
                              <tr key={room.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="border border-gray-300 px-2 py-2 text-center font-bold text-indigo-600 text-sm">
                                  {room.number}
                                </td>
                                <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                                  {room.primary_use || '-'}
                                </td>
                                <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                                  <div className="flex flex-col items-center">
                                    <span>{room.name}</span>
                                    <div className="flex gap-1 mt-1">
                                      {room.is_computer_lab && (
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                      )}
                                      {room.has_makren && (
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                      )}
                                    </div>
                                  </div>
                                </td>
                                <td className="border border-gray-300 px-2 py-2 text-center text-sm">
                                  {room.seat_count}
                                </td>
                                <td className="border border-gray-300 px-2 py-2 text-center">
                                  <div className="flex gap-1 justify-center">
                                    <button
                                      onClick={() => handleEditRoom(room)}
                                      className="bg-indigo-500 text-white text-xs px-2 py-1 rounded hover:bg-indigo-600"
                                      title="עריכה"
                                    >
                                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                      </svg>
                                    </button>
                                    <button
                                      onClick={() => handleDeleteRoom(room.id)}
                                      className="bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600"
                                      title="מחיקה"
                                    >
                                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                      </svg>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Center Column - Rooms ending with 00 */}
                      <div className="border-l border-gray-300">
                        <table className="min-w-full border-collapse">
                          <thead className="bg-blue-50">
                            <tr>
                              <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-blue-900">מס' חדר</th>
                              <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-blue-900">מקום</th>
                              <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-blue-900">שיבוץ</th>
                              <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-blue-900">מס' מקומות</th>
                              <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-blue-900">פעולות</th>
                            </tr>
                          </thead>
                          <tbody>
                            {centerRooms.map((room, index) => (
                              <tr key={room.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="border border-gray-300 px-2 py-2 text-center font-bold text-blue-600 text-sm">
                                  {room.number}
                                </td>
                                <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                                  {room.primary_use || '-'}
                                </td>
                                <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                                  <div className="flex flex-col items-center">
                                    <span>{room.name}</span>
                                    <div className="flex gap-1 mt-1">
                                      {room.is_computer_lab && (
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                      )}
                                      {room.has_makren && (
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                      )}
                                    </div>
                                  </div>
                                </td>
                                <td className="border border-gray-300 px-2 py-2 text-center text-sm">
                                  {room.seat_count}
                                </td>
                                <td className="border border-gray-300 px-2 py-2 text-center">
                                  <div className="flex gap-1 justify-center">
                                    <button
                                      onClick={() => handleEditRoom(room)}
                                      className="bg-indigo-500 text-white text-xs px-2 py-1 rounded hover:bg-indigo-600"
                                      title="עריכה"
                                    >
                                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                      </svg>
                                    </button>
                                    <button
                                      onClick={() => handleDeleteRoom(room.id)}
                                      className="bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600"
                                      title="מחיקה"
                                    >
                                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                      </svg>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Left Side Table - Odd Numbers */}
                      <div>
                        <table className="min-w-full border-collapse">
                          <thead className="bg-indigo-50">
                            <tr>
                              <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-indigo-900">מס' חדר</th>
                              <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-indigo-900">מקום</th>
                              <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-indigo-900">שיבוץ</th>
                              <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-indigo-900">מס' מקומות</th>
                              <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-indigo-900">פעולות</th>
                            </tr>
                          </thead>
                          <tbody>
                            {oddRooms.map((room, index) => (
                              <tr key={room.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="border border-gray-300 px-2 py-2 text-center font-bold text-indigo-600 text-sm">
                                  {room.number}
                                </td>
                                <td className="border border-gray-400 px-2 py-2 text-center text-xs">
                                  {room.primary_use || '-'}
                                </td>
                                <td className="border border-gray-400 px-2 py-2 text-center text-xs">
                                  <div className="flex flex-col items-center">
                                    <span>{room.name}</span>
                                    <div className="flex gap-1 mt-1">
                                      {room.is_computer_lab && (
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                      )}
                                      {room.has_makren && (
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                      )}
                                    </div>
                                  </div>
                                </td>
                                <td className="border border-gray-400 px-2 py-2 text-center text-sm">
                                  {room.seat_count}
                                </td>
                                <td className="border border-gray-400 px-2 py-2 text-center">
                                  <div className="flex gap-1 justify-center">
                                    <button
                                      onClick={() => handleEditRoom(room)}
                                      className="bg-blue-500 text-white text-xs px-2 py-1 rounded hover:bg-blue-600"
                                      title="עריכה"
                                    >
                                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                      </svg>
                                    </button>
                                    <button
                                      onClick={() => handleDeleteRoom(room.id)}
                                      className="bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600"
                                      title="מחיקה"
                                    >
                                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                      </svg>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Empty State */}
            {(!rooms || rooms.length === 0) && (
              <div className="text-center py-12">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <h3 className="text-xl font-bold text-gray-700 mb-2">אין חדרים במערכת</h3>
                <p className="text-gray-500 mb-4">התחל בהוספת חדר ראשון</p>
                <button
                  onClick={() => setShowAddRoomModal(true)}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  + הוסף חדר
                </button>
              </div>
            )}
          </div>
        )}

        {/* Add Room Modal */}
        {showAddRoomModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" dir="rtl">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">הוסף חדר חדש</h3>
                <form onSubmit={handleAddRoom}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">שם החדר</label>
                    <input
                      type="text"
                      required
                      value={newRoom.name}
                      onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">מספר חדר</label>
                    <input
                      type="text"
                      required
                      value={newRoom.number}
                      onChange={(e) => setNewRoom({ ...newRoom, number: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">קומה</label>
                    <input
                      type="number"
                      value={newRoom.floor}
                      onChange={(e) => setNewRoom({ ...newRoom, floor: parseInt(e.target.value) || 0 })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">מספר מקומות</label>
                    <input
                      type="number"
                      value={newRoom.seat_count}
                      onChange={(e) => setNewRoom({ ...newRoom, seat_count: parseInt(e.target.value) || 0 })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">שימוש ראשי</label>
                    <input
                      type="text"
                      value={newRoom.primary_use}
                      onChange={(e) => setNewRoom({ ...newRoom, primary_use: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="כיתה, מעבדה, אולם, משרד..."
                    />
                  </div>
                  <div className="mb-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newRoom.is_computer_lab}
                        onChange={(e) => setNewRoom({ ...newRoom, is_computer_lab: e.target.checked })}
                        // className="ml-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">מעבדת מחשבים</span>
                    </label>
                  </div>
                  <div className="mb-4">
                    <label className="flex items-center">
                      {/* <input
                        type="checkbox"
                        checked={newRoom.has_makren}
                        onChange={(e) => setNewRoom({ ...newRoom, has_makren: e.target.checked })}
                        className="ml-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      /> */}
                       <input
        type="checkbox"
        checked={newRoom.has_makren}
        onChange={(e) => setNewRoom({ ...newRoom, has_makren: e.target.checked })}
        className="mt-1 appearance-auto"
      />
                      <span className="text-sm font-medium text-gray-700">יש מקרן</span>
                    </label>
                  </div>
                  <div className="mb-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newRoom.is_available}
                        onChange={(e) => setNewRoom({ ...newRoom, is_available: e.target.checked })}
                        className="ml-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">זמין לשימוש</span>
                    </label>
                  </div>
                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setShowAddRoomModal(false)}
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

        {/* Edit Room Modal */}
        {showEditRoomModal && editingRoom && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" dir="rtl">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">ערוך חדר</h3>
                <form onSubmit={handleUpdateRoom}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">שם החדר</label>
                    <input
                      type="text"
                      required
                      value={editingRoom.name}
                      onChange={(e) => setEditingRoom({ ...editingRoom, name: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">מספר חדר</label>
                    <input
                      type="text"
                      required
                      value={editingRoom.number}
                      onChange={(e) => setEditingRoom({ ...editingRoom, number: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">קומה</label>
                    <input
                      type="number"
                      value={editingRoom.floor}
                      onChange={(e) => setEditingRoom({ ...editingRoom, floor: parseInt(e.target.value) || 0 })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">מספר מקומות</label>
                    <input
                      type="number"
                      value={editingRoom.seat_count}
                      onChange={(e) => setEditingRoom({ ...editingRoom, seat_count: parseInt(e.target.value) || 0 })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">שימוש ראשי</label>
                    <input
                      type="text"
                      value={editingRoom.primary_use}
                      onChange={(e) => setEditingRoom({ ...editingRoom, primary_use: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="כיתה, מעבדה, אולם, משרד..."
                    />
                  </div>
                  <div className="mb-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={editingRoom.is_computer_lab}
                        onChange={(e) => setEditingRoom({ ...editingRoom, is_computer_lab: e.target.checked })}
                        className="ml-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">מעבדת מחשבים</span>
                    </label>
                  </div>
                  <div className="mb-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={editingRoom.has_makren}
                        onChange={(e) => setEditingRoom({ ...editingRoom, has_makren: e.target.checked })}
                        className="ml-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">יש מקרן</span>
                    </label>
                  </div>
                  <div className="mb-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={editingRoom.is_available}
                        onChange={(e) => setEditingRoom({ ...editingRoom, is_available: e.target.checked })}
                        className="ml-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">זמין לשימוש</span>
                    </label>
                  </div>
                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => {
                        setShowEditRoomModal(false);
                        setEditingRoom(null);
                      }}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                    >
                      ביטול
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                    >
                      עדכן
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
                  <table key={permissionsUpdateKey} className="min-w-full divide-y divide-gray-200">
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
                      {(() => {
                        // סינון הרשאות כפולות - מציג כל מסך פעם אחת בלבד
                        const uniquePermissions = permissions.reduce((acc, permission) => {
                          const screenKey = permission.screen_name?.toLowerCase();
                          if (!acc.find(p => p.screen_name?.toLowerCase() === screenKey)) {
                            acc.push(permission);
                          }
                          return acc;
                        }, []);

                        return uniquePermissions.map((permission) => {
                          const rolePermission = getRolePermissionForPermission(
                            selectedRoleForEdit.id,
                            permission.id
                          );
                          const canView = rolePermission?.permission?.can_view ?? false;
                          const canEdit = rolePermission?.permission?.can_edit ?? false;

                          return (
                            <tr key={permission.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {getHebrewScreenName(permission.screen_name)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                <input
                                  type="checkbox"
                                  checked={canView}
                                  onChange={() => handleTogglePermission(permission, 'can_view')}
                                  style={{ appearance: 'auto', WebkitAppearance: 'checkbox' }}
                                  className="w-5 h-5 cursor-pointer"
                                />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                <input
                                  type="checkbox"
                                  checked={canEdit}
                                  onChange={() => handleTogglePermission(permission, 'can_edit')}
                                  style={{ appearance: 'auto', WebkitAppearance: 'checkbox' }}
                                  className="w-5 h-5 cursor-pointer"
                                />
                              </td>
                            </tr>
                          );
                        });
                      })()}
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
                              {getHebrewScreenName(permission.screen_name)}
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
