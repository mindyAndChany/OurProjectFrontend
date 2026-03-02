import React, { useState } from 'react';

const RoomsManagement = ({
  rooms,
  showAddRoomModal,
  setShowAddRoomModal,
  newRoom,
  setNewRoom,
  handleAddRoom,
  handleEditRoom,
  handleDeleteRoom,
  showEditRoomModal,
  setShowEditRoomModal,
  editingRoom,
  setEditingRoom,
  handleUpdateRoom,
  availabilityDate,
  setAvailabilityDate,
  availabilityStartTime,
  setAvailabilityStartTime,
  availabilityEndTime,
  setAvailabilityEndTime,
  highlightedRoomIds,
  availabilityLoading,
  handleCheckAvailability,
  handleResetAvailability
}) => {
  return (
    <>
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

            {/* בדיקת זמינות חדרים */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-6 border border-blue-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4">בדוק זמינות חדרים</h3>
              <form onSubmit={handleCheckAvailability} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">תאריך</label>
                  <input
                    type="date"
                    value={availabilityDate}
                    onChange={(e) => setAvailabilityDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">שעת התחלה</label>
                  <input
                    type="time"
                    value={availabilityStartTime}
                    onChange={(e) => setAvailabilityStartTime(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">שעת סיום</label>
                  <input
                    type="time"
                    value={availabilityEndTime}
                    onChange={(e) => setAvailabilityEndTime(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="flex items-end gap-2">
                  <button
                    type="submit"
                    disabled={availabilityLoading}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                  >
                    {availabilityLoading ? 'בדיקה...' : 'בדוק זמינות'}
                  </button>
                  {highlightedRoomIds.length > 0 && (
                    <button
                      type="button"
                      onClick={handleResetAvailability}
                      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                    >
                      ╳ ריסט
                    </button>
                  )}
                </div>
              </form>
            </div>
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
                              <tr 
                                key={room.id} 
                                className={
                                  highlightedRoomIds.includes(room.id) 
                                    ? 'bg-yellow-200' 
                                    : index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                }
                              >
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
                              <tr 
                                key={room.id} 
                                className={
                                  highlightedRoomIds.includes(room.id) 
                                    ? 'bg-yellow-200' 
                                    : index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                }
                              >
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
                              <tr 
                                key={room.id} 
                                className={
                                  highlightedRoomIds.includes(room.id) 
                                    ? 'bg-yellow-200' 
                                    : index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                }
                              >
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
                      onClick={() => { setShowEditRoomModal(false); setEditingRoom(null); }}
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

    </>
  );
};

export default RoomsManagement;
