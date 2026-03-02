import React from 'react';

const RolesManagement = ({
  roles,
  showAddRoleModal,
  setShowAddRoleModal,
  newRole,
  setNewRole,
  handleAddRole,
  handleDeleteRole,
  handleEditRolePermissions,
  viewRolePermissions,
  showEditRolePermissionsModal,
  setShowEditRolePermissionsModal,
  selectedRoleForEdit,
  permissionsUpdateKey,
  permissions,
  getRolePermissionForPermission,
  getHebrewScreenName,
  handleTogglePermission
}) => {
  return (
    <>
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
    </>
  );
};

export default RolesManagement;
