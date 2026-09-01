import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Package, Plus, RotateCcw, BookOpen, Search } from "lucide-react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Autocomplete,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import { getEquipmentThunk } from "../redux/slices/EQUIPMENTS/getEquipmentThunk.js";
import { addEquipmentItemThunk } from "../redux/slices/EQUIPMENTS/addEquipmentItemThunk.js";
import { borrowItem, returnItem } from "../redux/slices/EQUIPMENTS/equipmentSlice.js";
import { getStudentDataThunk } from "../redux/slices/STUDENTS/getStudentDataThunk.js";

const EQUIPMENT_CATEGORIES = ["גרפיקה", "צילום", "סאונד", "אחר"];

const Equipments = () => {
  const dispatch = useDispatch();

  const { items, loading } = useSelector((state) => state.equipment);
  const allStudents = useSelector((state) => state.student.studentsData || []);

  // סטייט לדיאלוג הוספת מוצר
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: EQUIPMENT_CATEGORIES[0],
    totalQuantity: 1,
  });

  // סטייט לדיאלוג השאלה
  const [borrowDialogOpen, setBorrowDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [borrowDate, setBorrowDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [expectedReturn, setExpectedReturn] = useState("");
  const [borrowNotes, setBorrowNotes] = useState("");
  const [borrowQuantity, setBorrowQuantity] = useState(1);

  // סטייט לצפייה בהיסטוריית השאלות
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [historyItem, setHistoryItem] = useState(null);

  // סטייט למיון וחיפוש
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("הכל");
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  // טעינת נתוני ציוד ותלמידות
  useEffect(() => {
    dispatch(getEquipmentThunk());
    if (allStudents.length === 0) {
      dispatch(getStudentDataThunk("first_name,last_name,id_number,class_kodesh"));
    }
  }, []);

  // מיון וסינון
  const filteredItems = useMemo(() => {
    let filtered = [...items];

    if (categoryFilter !== "הכל") {
      filtered = filtered.filter((item) => item.category === categoryFilter);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(term)
      );
    }

    if (sortField) {
      filtered.sort((a, b) => {
        const aVal = (a[sortField] || "").toString();
        const bVal = (b[sortField] || "").toString();
        const cmp = aVal.localeCompare(bVal, "he");
        return sortDirection === "asc" ? cmp : -cmp;
      });
    }

    return filtered;
  }, [items, categoryFilter, searchTerm, sortField, sortDirection]);

  // פונקציות מיון
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return " ⇅";
    return sortDirection === "asc" ? " ↑" : " ↓";
  };

  // חישוב כמות זמינה
  const getAvailableQuantity = (item) => {
    const borrowedCount = (item.borrowed || [])
      .filter((b) => b.status === "active")
      .reduce((sum, b) => sum + (Number(b.quantity) || 1), 0);
    return (item.totalQuantity || 0) - borrowedCount;
  };

  // הוספת מוצר חדש
  const handleAddProduct = () => {
    if (!newProduct.name.trim()) return;
    dispatch(addEquipmentItemThunk(newProduct));
    setAddDialogOpen(false);
    setNewProduct({ name: "", category: EQUIPMENT_CATEGORIES[0], totalQuantity: 1 });
  };

  // פתיחת דיאלוג השאלה
  const openBorrowDialog = (item) => {
    setSelectedItem(item);
    setSelectedStudent(null);
    setBorrowDate(new Date().toISOString().split("T")[0]);
    setExpectedReturn("");
    setBorrowNotes("");
    setBorrowQuantity(1);
    setBorrowDialogOpen(true);
  };

  // ביצוע השאלה
  const handleBorrow = () => {
    if (!selectedStudent || !selectedItem) return;
    dispatch(
      borrowItem({
        itemId: selectedItem.id,
        borrowRecord: {
          studentId: selectedStudent.id_number || selectedStudent.id,
          studentName: `${selectedStudent.first_name} ${selectedStudent.last_name}`,
          borrowDate,
          expectedReturn,
          notes: borrowNotes,
          quantity: borrowQuantity,
        },
      })
    );
    setBorrowDialogOpen(false);
  };

  // החזרת ציוד
  const handleReturn = (itemId, borrowId) => {
    dispatch(returnItem({ itemId, borrowId }));
  };

  // צפייה בהיסטוריה
  const openHistoryDialog = (item) => {
    setHistoryItem(item);
    setHistoryDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 pt-28 font-sans [direction:rtl]">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* כותרת */}
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8 text-[#0A3960]" />
            <h1 className="text-2xl font-bold text-[#0A3960]">השאלת ציוד</h1>
          </div>
          <Button
            variant="contained"
            startIcon={<Plus />}
            onClick={() => setAddDialogOpen(true)}
            sx={{ backgroundColor: "#0A3960", "&:hover": { backgroundColor: "#082d4a" } }}
          >
            הוספת מוצר חדש
          </Button>
        </motion.div>

        {/* מסננים */}
        <motion.div
          className="flex flex-wrap gap-4 items-center bg-white rounded-xl p-4 shadow-sm border border-gray-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="חיפוש מוצר..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0A3960]/20 focus:border-[#0A3960]"
            />
          </div>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>קטגוריה</InputLabel>
            <Select
              value={categoryFilter}
              label="קטגוריה"
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <MenuItem value="הכל">הכל</MenuItem>
              {EQUIPMENT_CATEGORIES.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </motion.div>

        {/* טבלת ציוד */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <TableContainer component={Paper} sx={{ borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#0A3960" }}>
                  <TableCell
                    sx={{ color: "white", fontWeight: "bold", cursor: "pointer" }}
                    onClick={() => handleSort("name")}
                  >
                    שם מוצר{getSortIcon("name")}
                  </TableCell>
                  <TableCell
                    sx={{ color: "white", fontWeight: "bold", cursor: "pointer" }}
                    onClick={() => handleSort("category")}
                  >
                    קטגוריה{getSortIcon("category")}
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    כמות כוללת
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    כמות זמינה
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    כמות שאולה
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    סטטוס
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    פעולות
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading && items.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                      <div className="text-gray-500 text-lg">טוען נתונים...</div>
                    </TableCell>
                  </TableRow>
                )}
                {!loading && filteredItems.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                      <div className="text-gray-500 text-lg">
                        {items.length === 0
                          ? 'לא נמצאו מוצרים. לחץ על "הוספת מוצר חדש" כדי להתחיל.'
                          : "לא נמצאו מוצרים מתאימים לסינון."}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
                {filteredItems.map((item, idx) => {
                  const available = getAvailableQuantity(item);
                  const borrowedCount = (item.borrowed || []).filter(
                    (b) => b.status === "active"
                  ).length;
                  const totalBorrowedQuantity = (item.borrowed || [])
                    .filter((b) => b.status === "active")
                    .reduce((sum, b) => sum + (Number(b.quantity) || 1), 0);
                  const isAvailable = available > 0;

                  return (
                    <TableRow
                      key={item.id}
                      sx={{
                        "&:nth-of-type(odd)": { backgroundColor: "#f8fafc" },
                        "&:hover": { backgroundColor: "#eef2f7" },
                      }}
                    >
                      <TableCell sx={{ fontWeight: 500 }}>{item.name}</TableCell>
                      <TableCell>
                        <Chip
                          label={item.category}
                          size="small"
                          variant="outlined"
                          color="primary"
                        />
                      </TableCell>
                      <TableCell>{item.totalQuantity}</TableCell>
                      <TableCell>
                        <span
                          className={
                            available > 0
                              ? "text-green-600 font-semibold"
                              : "text-red-500 font-semibold"
                          }
                        >
                          {available}
                        </span>
                      </TableCell>
                      <TableCell>{totalBorrowedQuantity}</TableCell>
                      <TableCell>
                        <Chip
                          label={isAvailable ? "פנוי" : "לא פנוי"}
                          size="small"
                          color={isAvailable ? "success" : "error"}
                          variant="filled"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Tooltip title="השאלה">
                            <span>
                              <IconButton
                                size="small"
                                onClick={() => openBorrowDialog(item)}
                                disabled={!isAvailable}
                                color="primary"
                              >
                                <BookOpen size={18} />
                              </IconButton>
                            </span>
                          </Tooltip>
                          {(item.borrowed || []).length > 0 && (
                            <>
                              <Tooltip title="היסטוריית השאלות">
                                <IconButton
                                  size="small"
                                  onClick={() => openHistoryDialog(item)}
                                  color="info"
                                >
                                  <Search size={18} />
                                </IconButton>
                              </Tooltip>
                              {/* כפתורי החזרה לשאלות פעילות */}
                              {(item.borrowed || [])
                                .filter((b) => b.status === "active")
                                .map((b) => (
                                  <Tooltip key={b.id} title={`החזר: ${b.studentName}`}>
                                    <IconButton
                                      size="small"
                                      onClick={() => handleReturn(item.id, b.id)}
                                      color="success"
                                    >
                                      <RotateCcw size={16} />
                                    </IconButton>
                                  </Tooltip>
                                ))}
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </motion.div>

        {/* דיאלוג הוספת מוצר */}
        <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ textAlign: "right" }}>הוספת מוצר חדש</DialogTitle>
          <DialogContent sx={{ textAlign: "right" }}>
            <div className="space-y-4 mt-2">
              <TextField
                label="שם המוצר"
                fullWidth
                required
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct((prev) => ({ ...prev, name: e.target.value }))
                }
                sx={{ "& .MuiOutlinedInput-root": { textAlign: "right" } }}
              />
              <FormControl fullWidth>
                <InputLabel>קטגוריה</InputLabel>
                <Select
                  value={newProduct.category}
                  label="קטגוריה"
                  onChange={(e) =>
                    setNewProduct((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                >
                  {EQUIPMENT_CATEGORIES.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="כמות כוללת"
                type="number"
                fullWidth
                value={newProduct.totalQuantity}
                onChange={(e) =>
                  setNewProduct((prev) => ({
                    ...prev,
                    totalQuantity: e.target.value,
                  }))
                }
                inputProps={{ min: 1 }}
              />
            </div>
          </DialogContent>
          <DialogActions sx={{ justifyContent: "flex-start", px: 3, pb: 2 }}>
            <Button onClick={() => setAddDialogOpen(false)}>ביטול</Button>
            <Button
              variant="contained"
              onClick={handleAddProduct}
              disabled={!newProduct.name.trim()}
              sx={{ backgroundColor: "#0A3960", "&:hover": { backgroundColor: "#082d4a" } }}
            >
              הוסף
            </Button>
          </DialogActions>
        </Dialog>

        {/* דיאלוג השאלה */}
        <Dialog open={borrowDialogOpen} onClose={() => setBorrowDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ textAlign: "right" }}>
            השאלת {selectedItem?.name || ""}
          </DialogTitle>
          <DialogContent sx={{ textAlign: "right" }}>
            <div className="space-y-4 mt-2">
              <Autocomplete
                options={allStudents}
                getOptionLabel={(option) =>
                  `${option.first_name} ${option.last_name}${
                    option.id_number ? ` (${option.id_number})` : ""
                  }${option.class_kodesh ? ` - ${option.class_kodesh}` : ""}`
                }
                value={selectedStudent}
                onChange={(_, newValue) => setSelectedStudent(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="בחרי תלמידה"
                    required
                    sx={{ "& .MuiOutlinedInput-root": { textAlign: "right" } }}
                  />
                )}
                isOptionEqualToValue={(option, value) =>
                  option.id_number === value?.id_number
                }
                noOptionsText="לא נמצאה תלמידה"
              />
              <TextField
                label="תאריך השאלה"
                type="date"
                fullWidth
                value={borrowDate}
                onChange={(e) => setBorrowDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="תאריך החזרה משוער"
                type="date"
                fullWidth
                value={expectedReturn}
                onChange={(e) => setExpectedReturn(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="כמות"
                type="number"
                fullWidth
                value={borrowQuantity}
                onChange={(e) => setBorrowQuantity(Number(e.target.value))}
                inputProps={{
                  min: 1,
                  max: selectedItem ? getAvailableQuantity(selectedItem) : 1,
                }}
                helperText={
                  selectedItem
                    ? `זמין: ${getAvailableQuantity(selectedItem)}`
                    : ""
                }
              />
              <TextField
                label="הערות"
                fullWidth
                multiline
                rows={2}
                value={borrowNotes}
                onChange={(e) => setBorrowNotes(e.target.value)}
                sx={{ "& .MuiOutlinedInput-root": { textAlign: "right" } }}
              />
            </div>
          </DialogContent>
          <DialogActions sx={{ justifyContent: "flex-start", px: 3, pb: 2 }}>
            <Button onClick={() => setBorrowDialogOpen(false)}>ביטול</Button>
            <Button
              variant="contained"
              onClick={handleBorrow}
              disabled={!selectedStudent}
              sx={{ backgroundColor: "#0A3960", "&:hover": { backgroundColor: "#082d4a" } }}
            >
              אשר השאלה
            </Button>
          </DialogActions>
        </Dialog>

        {/* דיאלוג היסטוריית השאלות */}
        <Dialog
          open={historyDialogOpen}
          onClose={() => setHistoryDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ textAlign: "right" }}>
            היסטוריית השאלות - {historyItem?.name || ""}
          </DialogTitle>
          <DialogContent sx={{ textAlign: "right" }}>
            {historyItem && (historyItem.borrowed || []).length === 0 && (
              <div className="text-gray-500 text-center py-6">
                אין היסטוריית השאלות למוצר זה
              </div>
            )}
            {historyItem && (historyItem.borrowed || []).length > 0 && (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#f0f4f8" }}>
                      <TableCell sx={{ fontWeight: "bold" }}>תלמידה</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>תאריך השאלה</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>החזרה משוערת</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>תאריך החזרה</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>כמות</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>סטטוס</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>הערות</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>פעולות</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(historyItem.borrowed || []).map((b) => (
                      <TableRow key={b.id}>
                        <TableCell>{b.studentName}</TableCell>
                        <TableCell>{b.borrowDate}</TableCell>
                        <TableCell>{b.expectedReturn || "-"}</TableCell>
                        <TableCell>{b.returnedDate || "-"}</TableCell>
                        <TableCell>{b.quantity || 1}</TableCell>
                        <TableCell>
                          <Chip
                            label={b.status === "active" ? "מושאל" : "הוחזר"}
                            size="small"
                            color={b.status === "active" ? "warning" : "success"}
                            variant="filled"
                          />
                        </TableCell>
                        <TableCell>{b.notes || "-"}</TableCell>
                        <TableCell>
                          {b.status === "active" && (
                            <Button
                              size="small"
                              variant="outlined"
                              color="success"
                              startIcon={<RotateCcw size={14} />}
                              onClick={() => {
                                handleReturn(historyItem.id, b.id);
                              }}
                            >
                              החזר
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </DialogContent>
          <DialogActions sx={{ justifyContent: "flex-start", px: 3, pb: 2 }}>
            <Button onClick={() => setHistoryDialogOpen(false)}>סגור</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default Equipments;
