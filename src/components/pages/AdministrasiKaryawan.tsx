import React, { useEffect, useState } from "react";
import {
  Users,
  Plus,
  Trash2,
  User,
  Mail,
  Search,
  Building,
  Edit,
} from "lucide-react";
import {
  getDaftarKaryawan,
  getGerai,
  handleAddKaryawan,
  handleDeleteKaryawan,
  handleUpdateKaryawan,
} from "../../firebase/service";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { MdSend } from "react-icons/md";

interface Employee {
  id: number;
  nama: string;
  gerai: string;
  divisi: string;
  email: string;
}
interface Gerai {
  id: number;
  nama: string;
}

const AdministrasiKaryawan: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [gerai, setGerai] = useState<Gerai[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newEmployee, setNewEmployee] = useState<Omit<Employee, "id">>({
    nama: "",
    gerai: "",
    email: "",
    divisi: "",
  });
  const [indexEdit, setIndexEdit] = useState(0);

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    handleAddKaryawan({
      nama: newEmployee.nama,
      gerai: newEmployee.gerai,
      divisi: newEmployee.divisi,
      email: newEmployee.email,
    }).then((res: any) => {
      if(res){
        Swal.fire("Berhasil", "Data Anda berhasil terdaftar", "success");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    });
    // if (newEmployee.name && newEmployee.position && newEmployee.email) {
    //   const employee: Employee = {
    //     ...newEmployee,
    //     id: Date.now(),
    //   };
    //   setEmployees([...employees, employee]);
    //   setNewEmployee({
    //     name: "",
    //     position: "",
    //     email: "",
    //     phone: "",
    //     joinDate: "",
    //     department: "",
    //   });
    //   setShowAddForm(false);
  };

  const handleDeleteEmployee = (id: string) => {
    const boolean = confirm("Apakah Anda yakin ingin menghapus karyawan ini?");
    if (boolean) {
      handleDeleteKaryawan(id).then((res: any) => {
        if (res) {
          Swal.fire("Berhasil", "Data Anda berhasil dihapus!", "success");
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      });
    }
    // handleDeleteEmployee(id);
  };

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.divisi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.gerai.toLowerCase().includes(searchTerm.toLowerCase())
    //   emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function handleUpdateEmployee(e: any) {
    e.preventDefault();
    handleUpdateKaryawan(indexEdit, {
      nama: e.target.nama.value,
      gerai: e.target.gerai.value,
      divisi: e.target.divisi.value,
      email: e.target.email.value,
    }).then((res: any) => {
      if (res) {
        Swal.fire("Berhasil", "Data Anda berhasil diubah!", "success");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    });
  }

  function handleClickEdit(id: number) {
    setIndexEdit(id);
  }

  useEffect(() => {
    getGerai().then((res: any) => {
      setGerai(res);
    });
    getDaftarKaryawan().then((res: any) => {
      setEmployees(res);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-700 via-orange-500 to-orange-700 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Manajemen Karyawan
                </h1>
              </div>
            </div>
            <div className="grid gap-3">
              <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-xl">
                <p className="text-white font-semibold flex gap-2">
                  <Users /> {employees.length} Karyawan Aktif
                </p>
              </div>
              <Link
                to="/rekap-absensi-karyawan"
                className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-xl"
              >
                <p className="text-white font-semibold">Rekap Absensi Harian</p>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Action Bar */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-orange-100">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Cari karyawan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-orange-200 rounded-xl focus:border-orange-500 focus:ring-0 transition-colors"
              />
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-orange-500 hover:from-orange-600 hover:to-yellow-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Plus className="h-5 w-5" />
              <span>Tambah Karyawan</span>
            </button>
          </div>
        </div>

        {/* Employee Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredEmployees.map((employee) => (
            <div key={employee.id}>
              {employee.id !== indexEdit ? (
                <div
                  key={employee.id}
                  className="bg-white rounded-2xl shadow-xl border border-orange-100 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group"
                >
                  <div className="bg-gradient-to-r from-orange-600 to-yellow-500 h-24 relative">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <button
                      onClick={() =>
                        handleDeleteEmployee(employee.id.toString())
                      }
                      className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-sm p-2 rounded-lg hover:bg-red-500 hover:text-white transition-all duration-300 group-hover:scale-110"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setIndexEdit(employee.id)}
                      className="absolute bottom-4 right-[4em] bg-white/20 backdrop-blur-sm p-2 rounded-lg hover:bg-red-500 hover:text-white transition-all duration-300 group-hover:scale-110"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="p-6 -mt-8 relative">
                    <div className="bg-white w-16 h-16 rounded-xl shadow-lg flex items-center justify-center mb-4 border-4 border-orange-100">
                      <User className="h-8 w-8 text-orange-500" />
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {employee.nama.toUpperCase()}
                    </h3>
                    <p className="text-orange-600 font-semibold mb-4 text-lg">
                      {employee.divisi.toUpperCase()}
                    </p>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 text-gray-600">
                        <Building className="h-4 w-4 text-orange-400" />
                        <span className="text-lg">
                          {employee.gerai.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3 text-gray-600">
                        <Mail className="h-4 w-4 text-orange-400" />
                        <span className="text-sm">{employee.email}</span>
                      </div>
                      {/* <div className="flex items-center space-x-3 text-gray-600">
                    <Phone className="h-4 w-4 text-orange-400" />
                    <span className="text-sm">{employee.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-600">
                    <Calendar className="h-4 w-4 text-orange-400" />
                    <span className="text-sm">
                      Bergabung:{" "}
                      {new Date(employee.joinDate).toLocaleDateString("id-ID")}
                    </span>
                  </div> */}
                    </div>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={handleUpdateEmployee}
                  key={employee.id}
                  className="bg-white rounded-2xl shadow-xl border border-orange-100 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group"
                >
                  <div className="bg-gradient-to-r from-orange-600 to-yellow-500 h-24 relative">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <button
                      onClick={() =>
                        handleDeleteEmployee(employee.id.toString())
                      }
                      className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-sm p-2 rounded-lg hover:bg-red-500 hover:text-white transition-all duration-300 group-hover:scale-110"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleClickEdit(employee.id)}
                      className="absolute bottom-4 right-[4em] bg-white/20 backdrop-blur-sm p-2 rounded-lg hover:bg-red-500 hover:text-white transition-all duration-300 group-hover:scale-110"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="p-6 -mt-8 relative">
                    <div className="bg-white w-16 h-16 rounded-xl shadow-lg flex items-center justify-center mb-4 border-4 border-orange-100">
                      <User className="h-8 w-8 text-orange-500" />
                    </div>
                    <input
                      type="text"
                      defaultValue={employee.nama}
                      name="nama"
                      onChange={(e) =>
                        setNewEmployee({
                          ...newEmployee,
                          nama: e.target.value,
                        })
                      }
                      className="bg-orange-100 p-2 rounded-xl text-xl  text-gray-900 mb-2 w-full"
                    />
                    <input
                      type="text"
                      name="divisi"
                      defaultValue={employee.divisi}
                      onChange={(e) =>
                        setNewEmployee({
                          ...newEmployee,
                          divisi: e.target.value,
                        })
                      }
                      className="bg-orange-100 p-2 rounded-xl text-xl  text-gray-900 mb-2 w-full"
                    />

                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 text-gray-600">
                        <Building className="h-4 w-4 text-orange-400" />
                        <select
                          name="gerai"
                          defaultValue={employee.gerai.toLowerCase()}
                          onChange={(e) =>
                            setNewEmployee({
                              ...newEmployee,
                              gerai: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:border-orange-500 focus:ring-0 transition-colors"
                          required
                        >
                          {gerai.map((gerai, index) => (
                            <option key={index} value={gerai.nama}>
                              {gerai.nama.toUpperCase()}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-center space-x-3 text-gray-600">
                        <Mail className="h-4 w-4 text-orange-400" />
                        <input
                          name="email"
                          type="text"
                          defaultValue={employee.email.toUpperCase()}
                          onChange={(e) =>
                            setNewEmployee({
                              ...newEmployee,
                              email: e.target.value,
                            })
                          }
                          className="bg-orange-100 p-2 rounded-xl text-xl  text-gray-900 mb-2 w-full"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end mx-10 mb-5 gap-2">
                    <div
                      onClick={() => setIndexEdit(0)}
                      className="bg-gray-600 hover:cursor-pointer text-white p-3 rounded-xl text-xl gap-2 flex items-center"
                    >
                      BATAL
                    </div>
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-orange-600 to-yellow-500 text-white p-3 rounded-xl text-xl gap-2 flex items-center"
                    >
                      UBAH
                      <MdSend />
                    </button>
                  </div>
                </form>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredEmployees.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-gradient-to-r from-orange-400 to-yellow-400 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="h-12 w-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Tidak ada karyawan ditemukan
            </h3>
            <p className="text-gray-600 mb-6">
              Coba ubah kata kunci pencarian atau tambah karyawan baru.
            </p>
          </div>
        )}
      </div>

      {/* Add Employee Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form
            onSubmit={handleAddEmployee}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="bg-gradient-to-r from-orange-500 to-orange-700 p-6 rounded-t-2xl">
              <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
                <Plus className="h-6 w-6" />
                <span>Tambah Karyawan Baru</span>
              </h2>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={newEmployee.nama}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, nama: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:border-orange-500 focus:ring-0 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Posisi
                </label>
                <input
                  type="text"
                  value={newEmployee.divisi}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, divisi: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:border-orange-500 focus:ring-0 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Gerai
                </label>
                <select
                  value={newEmployee.gerai}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, gerai: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:border-orange-500 focus:ring-0 transition-colors"
                  required
                >
                  <option value="">Pilih Gerai</option>
                  {gerai.map((gerai, index) => (
                    <option key={index} value={gerai.nama}>
                      {gerai.nama.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={newEmployee.email}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, email: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:border-orange-500 focus:ring-0 transition-colors"
                  required
                />
              </div>

              {/* <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nomor Telepon
                </label>
                <input
                  type="tel"
                  value={newEmployee.phone}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, phone: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:border-orange-500 focus:ring-0 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tanggal Bergabung
                </label>
                <input
                  type="date"
                  value={newEmployee.joinDate}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, joinDate: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:border-orange-500 focus:ring-0 transition-colors"
                />
              </div> */}

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-xl font-semibold transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-yellow-600 text-white py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  Tambah Karyawan
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdministrasiKaryawan;
