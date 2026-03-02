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
import UsersManagement from './UsersManagement';
import RolesManagement from './RolesManagement';
import RoomsManagement from './RoomsManagement';

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

        {/* Section content */}
        {selectedSection === 'users' && (
          <UsersManagement
            users={users}
            roles={roles}
            showAddUserModal={showAddUserModal}
            setShowAddUserModal={setShowAddUserModal}
            newUser={newUser}
            setNewUser={setNewUser}
            handleAddUser={handleAddUser}
            handleUpdateUserRole={handleUpdateUserRole}
            handleToggleUserActive={handleToggleUserActive}
            handleDeleteUser={handleDeleteUser}
            viewRolePermissions={viewRolePermissions}
            getRoleName={getRoleName}
          />
        )}
        {selectedSection === 'roles' && (
          <RolesManagement
            roles={roles}
            showAddRoleModal={showAddRoleModal}
            setShowAddRoleModal={setShowAddRoleModal}
            newRole={newRole}
            setNewRole={setNewRole}
            handleAddRole={handleAddRole}
            handleDeleteRole={handleDeleteRole}
            handleEditRolePermissions={handleEditRolePermissions}
            viewRolePermissions={viewRolePermissions}
            showEditRolePermissionsModal={showEditRolePermissionsModal}
            setShowEditRolePermissionsModal={setShowEditRolePermissionsModal}
            selectedRoleForEdit={selectedRoleForEdit}
            permissionsUpdateKey={permissionsUpdateKey}
            permissions={permissions}
            getRolePermissionForPermission={getRolePermissionForPermission}
            getHebrewScreenName={getHebrewScreenName}
            handleTogglePermission={handleTogglePermission}
          />
        )}
        {selectedSection === 'rooms' && (
          <RoomsManagement
            rooms={rooms}
            showAddRoomModal={showAddRoomModal}
            setShowAddRoomModal={setShowAddRoomModal}
            newRoom={newRoom}
            setNewRoom={setNewRoom}
            handleAddRoom={handleAddRoom}
            handleEditRoom={handleEditRoom}
            handleDeleteRoom={handleDeleteRoom}
            showEditRoomModal={showEditRoomModal}
            setShowEditRoomModal={setShowEditRoomModal}
            editingRoom={editingRoom}
            setEditingRoom={setEditingRoom}
            handleUpdateRoom={handleUpdateRoom}
          />
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
