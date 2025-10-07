import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { 
  Users, 
  DollarSign, 
  Calendar, 
  Search, 
  Download, 
  RefreshCw,
  Eye,
  Edit,
  CheckCircle,
  Clock,
  XCircle,
  Filter,
  LogOut
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "../hooks/use-toast";
import AdminLogin from "../components/AdminLogin";

const AdminDashboard = () => {
  const [registrations, setRegistrations] = useState([]);
  const [stats, setStats] = useState(null);
  const [paymentStats, setPaymentStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [specialtyFilter, setSpecialtyFilter] = useState("all");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if already logged in
    const loggedIn = localStorage.getItem("adminLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

      // Fetch registrations
      const regResponse = await fetch(`${BACKEND_URL}/api/registrations`);
      const regData = await regResponse.json();
      if (regData.success) {
        setRegistrations(regData.data);
      }

      // Fetch registration stats
      const statsResponse = await fetch(`${BACKEND_URL}/api/registrations/stats/summary`);
      const statsData = await statsResponse.json();
      if (statsData.success) {
        setStats(statsData.data);
      }

      // Fetch payment stats
      const paymentResponse = await fetch(`${BACKEND_URL}/api/payments/stats/summary`);
      const paymentData = await paymentResponse.json();
      if (paymentData.success) {
        setPaymentStats(paymentData.data);
      }

    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch dashboard data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateRegistrationStatus = async (registrationId, newStatus) => {
    try {
      const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(`${BACKEND_URL}/api/registrations/${registrationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registrationStatus: newStatus })
      });

      const result = await response.json();
      if (result.success) {
        toast({
          title: "Success",
          description: `Registration status updated to ${newStatus}`
        });
        fetchData(); // Refresh data
      }
    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to update registration status",
        variant: "destructive"
      });
    }
  };

  const exportToCSV = () => {
    const headers = [
      "ID", "Name", "Email", "Mobile", "Specialty", "Clinic", "Registration Date", 
      "Status", "Payment Status", "Nationality", "Emergency Contact"
    ];
    
    const csvContent = [
      headers.join(","),
      ...filteredRegistrations.map(reg => [
        reg.id,
        `"${reg.fullName}"`,
        reg.email,
        reg.mobile,
        reg.specialty,
        `"${reg.clinicName}"`,
        new Date(reg.registrationDate).toLocaleDateString(),
        reg.registrationStatus,
        reg.paymentStatus,
        reg.nationality,
        reg.emergencyContact
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `KICON_2025_Registrations_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredRegistrations = registrations.filter(reg => {
    const matchesSearch = reg.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reg.mobile.includes(searchTerm);
    const matchesStatus = statusFilter === "all" || reg.registrationStatus === statusFilter;
    const matchesSpecialty = specialtyFilter === "all" || reg.specialty === specialtyFilter;
    
    return matchesSearch && matchesStatus && matchesSpecialty;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "full_paid": return "bg-green-100 text-green-800";
      case "advance_paid": return "bg-blue-100 text-blue-800";
      case "unpaid": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    setIsLoggedIn(false);
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully"
    });
  };

  // Show login screen if not authenticated
  if (!isLoggedIn) {
    return <AdminLogin onLogin={setIsLoggedIn} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">KICON 2025 Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage registrations and track convention progress</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={fetchData} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Link to="/">
                <Button variant="outline" size="sm">Back to Website</Button>
              </Link>
              <Button onClick={handleLogout} variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100">Total Registrations</p>
                    <p className="text-3xl font-bold">{stats.total_registrations}</p>
                  </div>
                  <Users className="h-12 w-12 text-blue-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100">Available Spots</p>
                    <p className="text-3xl font-bold">{stats.available_spots}</p>
                  </div>
                  <Calendar className="h-12 w-12 text-green-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100">Confirmed</p>
                    <p className="text-3xl font-bold">{stats.by_status.confirmed}</p>
                  </div>
                  <CheckCircle className="h-12 w-12 text-purple-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-100">Expected Revenue</p>
                    <p className="text-2xl font-bold">₹{paymentStats ? (stats.total_registrations * paymentStats.amounts.per_registration_inr).toLocaleString() : '0'}</p>
                  </div>
                  <DollarSign className="h-12 w-12 text-emerald-200" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filters & Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, email, phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by specialty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specialties</SelectItem>
                  <SelectItem value="dermatology">Dermatology</SelectItem>
                  <SelectItem value="dentistry">Dentistry</SelectItem>
                  <SelectItem value="cosmetology">Cosmetology</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>

              <Button onClick={exportToCSV} className="bg-emerald-600 hover:bg-emerald-700">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Registrations Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              Registrations ({filteredRegistrations.length} of {registrations.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Name & Contact</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Professional Info</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Registration</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredRegistrations.map((registration) => (
                    <tr key={registration.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-semibold text-gray-900">{registration.fullName}</p>
                          <p className="text-sm text-gray-600">{registration.email}</p>
                          <p className="text-sm text-gray-600">{registration.mobile}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{registration.specialty}</p>
                          <p className="text-sm text-gray-600">{registration.clinicName}</p>
                          <p className="text-sm text-gray-600">{registration.yearsOfPractice} years exp.</p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <p className="text-sm text-gray-900">
                            {new Date(registration.registrationDate).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-600">ID: {registration.id.slice(0, 8)}...</p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="space-y-2">
                          <Badge className={getStatusColor(registration.registrationStatus)}>
                            {registration.registrationStatus}
                          </Badge>
                          <br />
                          <Badge className={getPaymentStatusColor(registration.paymentStatus)}>
                            {registration.paymentStatus}
                          </Badge>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => updateRegistrationStatus(registration.id, "confirmed")}
                            disabled={registration.registrationStatus === "confirmed"}
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Confirm
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => updateRegistrationStatus(registration.id, "cancelled")}
                            disabled={registration.registrationStatus === "cancelled"}
                          >
                            <XCircle className="h-3 w-3 mr-1" />
                            Cancel
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredRegistrations.length === 0 && (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No registrations found matching your filters.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;