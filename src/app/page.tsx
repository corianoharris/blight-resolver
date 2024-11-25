
'use client';

/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { MapPin, User, LogOut, CheckCircle, Clock } from 'lucide-react';

// Types shortened for clarity but complete
interface Case {
  id: number;
  lat: number;
  lng: number;
  title: string;
  points: number;
  status: 'pending' | 'approved' | 'rejected';
  description: string;
  address: string;
}

interface UserCase {
  id: number;
  status: 'pending' | 'approved' | 'rejected';
  title: string;
}

interface User {
  id: number;
  name: string;
  points: number;
  badges: string[];
  cases: UserCase[];
}

interface NavigationProps {
  isAdmin: boolean;
  currentRoute: string;
  setCurrentRoute: (route: string) => void;
}

// interface RouteProps {
//   setCurrentRoute: (route: string) => void;
//   setIsAdmin?: (isAdmin: boolean) => void;
//   setSelectedCase?: (caseId: number) => void;
// }

const testLoginUser = {
  email: 'Lc0sJ@example.com',
  password: 'password'
}

const mockCases: Case[] = [
  {
    id: 1, 
    lat: 40.7128,
    lng: -74.0060,
    title: 'Abandoned Building',
    points: 100,
    status: 'pending',
    description: 'Large abandoned warehouse with broken windows',
    address: '123 Main St'
  },
  {
    id: 2,
    lat: 40.7580,
    lng: -73.9855,
    title: 'Graffiti',
    points: 50,
    status: 'approved',
    description: 'Excessive graffiti on public property',
    address: '456 Park Ave'
  }
];

const mockPinCases: Case[] = [
  {
    id: 1,
    lat: 5.7128,
    lng: -45.0060,
    title: 'Abandoned Building',
    points: 100,
    status: 'pending',
    description: 'Large abandoned warehouse with broken windows and structural damage',
    address: '123 Main St'
  },
  {
    id: 2,
    lat: 12.7580,
    lng: -73.9855,
    title: 'Illegal Dumping',
    points: 75,
    status: 'pending',
    description: 'Construction debris and household waste dumped in vacant lot',
    address: '456 Park Ave'
  },
  {
    id: 3,
    lat: 40.7329,
    lng: -89.9987,
    title: 'Overgrown Lot',
    points: 50,
    status: 'pending',
    description: 'Unmaintained lot with tall grass and invasive plants',
    address: '789 Broadway'
  },
  {
    id: 4,
    lat: 34.7433,
    lng: -12.9422,
    title: 'Graffiti Vandalism',
    points: 40,
    status: 'pending',
    description: 'Multiple graffiti tags on public building walls',
    address: '321 East Side Ave'
  },
  {
    id: 5,
    lat: -20.7589,
    lng: -34.9677,
    title: 'Broken Streetlight',
    points: 30,
    status: 'pending',
    description: 'Non-functioning streetlight creating safety hazard',
    address: '654 Madison Ave'
  }
];

const mockUser: User = {
  id: 1,
  name: 'John Doe',
  points: 450,
  badges: ['Cleanup Champion', 'First Report'],
  cases: [
    { id: 1, status: 'approved', title: 'Abandoned Building' },
    { id: 2, status: 'pending', title: 'Graffiti Report' }
  ]
};

const App = () => {
  const [currentRoute, setCurrentRoute] = useState('login');
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedCase, setSelectedCase] = useState<number | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const Navigation = ({ isAdmin, currentRoute, setCurrentRoute }: NavigationProps) => (
    <nav className="bg-blue-600 text-white p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="font-bold text-xl">Blight Reporter</div>
        {!isAdmin && (
          <div className="flex space-x-4">
            <button onClick={() => setCurrentRoute('cases')} className="flex items-center">
              <MapPin className="mr-1" /> Cases
            </button>
            <button onClick={() => setCurrentRoute('profile')} className="flex items-center">
              <User className="mr-1" /> Profile
            </button>
          </div>
        )}
        <button onClick={() => setCurrentRoute('login')} className="flex items-center">
          <LogOut className="mr-1" /> Logout
        </button>
      </div>
    </nav>
  );

  const Login = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Blight Reporter Login</h1>
        <form onSubmit={(e) => {
          e.preventDefault();
          const isAdminChecked = (e.target as HTMLFormElement).elements.namedItem('isAdmin') as HTMLInputElement;
          setIsAdmin(isAdminChecked.checked);
          setCurrentRoute(isAdminChecked.checked ? 'admin' : 'cases');
        }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" className="w-full p-2 border rounded" required value={testLoginUser.email} readOnly />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input type="password" className="w-full p-2 border rounded" required value={testLoginUser.password} readOnly/>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isAdmin"
              className="mr-2"
            />
            <label className="text-sm">Login as Admin</label>
          </div>
          <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
            Login
          </button>
        </form>
      </div>
    </div>
  );

  const CasesMap = () => (
    <div className="h-[calc(100vh-64px)]">
      <div className="bg-gray-200 h-full relative">
        <div className="absolute inset-0">
          {mockPinCases.map((case_, index) => {
            // Calculate positions to spread pins across the map
            const top = 20 + (Math.random() * index * 15); // Spread vertically
            const left = 20 + (Math.random() * 18); // Spread horizontally
            
            return (
              <div
                key={case_.id}
                className="absolute cursor-pointer group"
                style={{ 
                  top: `${top}%`, 
                  left: `${left}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                onClick={() => {
                  setSelectedCase(case_.id);
                  setCurrentRoute('case-detail');
                }}
              >
                <MapPin className={`${
                  case_.points >= 75 ? 'text-red-500' : 
                  case_.points >= 50 ? 'text-orange-500' : 
                  'text-yellow-500'
                } h-8 w-8`} />
                <div className="hidden group-hover:block absolute bg-white p-4 rounded shadow-lg z-10 w-64 -translate-x-1/2">
                  <h3 className="font-bold">{case_.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{case_.description}</p>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Points: {case_.points}</span>
                    <span className="text-sm text-gray-500">{case_.status}</span>
                  </div>
                  <p className="text-sm mb-2">{case_.address}</p>
                  <button className="text-blue-600 hover:underline text-sm">
                    Take me there
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const CaseDetail = () => {
    const [image, setImage] = useState<File | null>(null);

    return (
      <div className="max-w-2xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Report Blight Case</h2>
        <form onSubmit={(e) => {
          e.preventDefault();
          alert('Case submitted successfully!');
          setCurrentRoute('cases');
        }} className="space-y-4">
          <div>
            <h3 className="font-bold">Case Information</h3>
            <p>Location: 123 Main St</p>
            <p>Type: Abandoned Building</p>
            <p>Points: 100</p>
          </div>
          <div>
            <label className="block font-medium mb-2">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              className="w-full"
            />
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Submit Report</button>
        </form>
      </div>
    );
  };

  const UserProfile = () => {
    // Calculate progress to next level
    const currentPoints = mockUser.points;
    const nextLevelPoints = 500; // Example threshold for next level
    const pointsNeeded = nextLevelPoints - currentPoints;
    const progressPercentage = (currentPoints / nextLevelPoints) * 100;
  
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Profile Dashboard</h2>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold">{mockUser.points}</div>
              <div className="text-gray-600">Total Points</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{mockUser.badges.length}</div>
              <div className="text-gray-600">Badges Earned</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{mockUser.cases.length}</div>
              <div className="text-gray-600">Total Cases</div>
            </div>
          </div>
        </div>
  
        {/* New Progress Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-bold mb-4">Level Progress</h3>
          <div className="space-y-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Current Level Points: {currentPoints}</span>
              <span>Next Level: {nextLevelPoints}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className="bg-blue-600 rounded-full h-4 transition-all duration-300"
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              ></div>
            </div>
            <div className="text-center text-sm text-gray-600">
              {pointsNeeded} points needed for next level
            </div>
          </div>
        </div>
  
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold mb-4">Your Cases</h3>
          <div className="space-y-4">
            {mockUser.cases.map((case_) => (
              <div key={case_.id} className="flex items-center justify-between border-b pb-2">
                <div>
                  <div className="font-medium">{case_.title}</div>
                  <div className="text-sm text-gray-600">{case_.status}</div>
                </div>
                {case_.status === 'approved' ? (
                  <CheckCircle className="text-green-500" />
                ) : (
                  <Clock className="text-yellow-500" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const AdminDashboard = () => (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-3xl font-bold text-green-600">15</div>
          <div className="text-gray-600">Approved Cases</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-3xl font-bold text-yellow-600">8</div>
          <div className="text-gray-600">Pending Cases</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-3xl font-bold text-red-600">3</div>
          <div className="text-gray-600">Rejected Cases</div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Pending Cases</h2>
        <table className="w-full">
          <thead>
            <tr className="text-left border-b">
              <th className="pb-2">Case ID</th>
              <th className="pb-2">Location</th>
              <th className="pb-2">Type</th>
              <th className="pb-2">Date</th>
              <th className="pb-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {mockCases.map((case_) => (
              <tr key={case_.id} className="border-b">
                <td className="py-2">#{case_.id}</td>
                <td>{case_.address}</td>
                <td>{case_.title}</td>
                <td>2024-11-24</td>
                <td>
                  <button
                    onClick={() => {
                      setSelectedCase(case_.id);
                      setCurrentRoute('admin-case-review');
                    }}
                    className="text-blue-600 hover:underline"
                  >
                    Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const AdminCaseReview = () => (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Case Review</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-bold">Case Information</h3>
            <p>Location: 123 Main St</p>
            <p>Type: Abandoned Building</p>
            <p>Reporter: John Doe</p>
            <p>Date: 2024-11-24</p>
          </div>
          <div>
            <h3 className="font-bold mb-2">Uploaded Image</h3>
            <div className="bg-gray-200 h-48 flex items-center justify-center rounded">
              <span className="text-gray-500">Image Preview</span>
            </div>
          </div>
          <div>
            <label className="block font-bold mb-2">Review Comments</label>
            <textarea
              className="w-full p-2 border rounded"
              rows={4}
              placeholder="Add your review comments..."
            />
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => {
                alert('Case approved!');
                setCurrentRoute('admin');
              }}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Approve
            </button>
            <button
              onClick={() => {
                alert('Case rejected!');
                setCurrentRoute('admin');
              }}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentRoute) {
      case 'login':
        return <Login />;
      case 'cases':
        return (
          <>
            <Navigation isAdmin={false} currentRoute={currentRoute} setCurrentRoute={setCurrentRoute} />
            <CasesMap />
          </>
        );
      case 'case-detail':
        return (
          <>
            <Navigation isAdmin={false} currentRoute={currentRoute} setCurrentRoute={setCurrentRoute} />
            <CaseDetail />
          </>
        );
      case 'profile':
        return (
          <>
            <Navigation isAdmin={false} currentRoute={currentRoute} setCurrentRoute={setCurrentRoute} />
            <UserProfile />
          </>
        );
      case 'admin':
        return (
          <>
            <Navigation isAdmin={true} currentRoute={currentRoute} setCurrentRoute={setCurrentRoute} />
            <AdminDashboard />
          </>
        );
      case 'admin-case-review':
        return (
          <>
            <Navigation isAdmin={true} currentRoute={currentRoute} setCurrentRoute={setCurrentRoute} />
            <AdminCaseReview />
          </>
        );
      default:
        return <Login />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderContent()}
    </div>
  );
};

export default App;