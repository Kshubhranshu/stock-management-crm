import PageHeader from "@/components/PageHeader";
import { IoMdPerson } from "react-icons/io";

export default function Account() {
    return (
        <div className="p-8 bg-white">
            <PageHeader title="Account" />

            <div className="max-w-4xl mx-auto">
                {/* Profile Section */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Profile
                    </h2>
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-start space-x-6">
                            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                                <IoMdPerson className="w-12 h-12 text-gray-400" />
                            </div>
                            <div className="flex-1">
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                            defaultValue="Kumar Shubhranshu"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                            defaultValue="babayaga@johnwick.com"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Settings Section */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Settings
                    </h2>
                    <div className="space-y-4">
                        {/* Preferences */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Preferences
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900">
                                            Email Notifications
                                        </h4>
                                        <p className="text-sm text-gray-500">
                                            Receive email updates about your
                                            account
                                        </p>
                                    </div>
                                    <button className="px-3 py-2 bg-gray-100 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-200">
                                        Configure
                                    </button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900">
                                            Dark Mode
                                        </h4>
                                        <p className="text-sm text-gray-500">
                                            Toggle dark mode theme
                                        </p>
                                    </div>
                                    <button className="px-3 py-2 bg-gray-100 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-200">
                                        Enable
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Security */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Security
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900">
                                            Change Password
                                        </h4>
                                        <p className="text-sm text-gray-500">
                                            Update your password
                                        </p>
                                    </div>
                                    <button className="px-3 py-2 bg-gray-100 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-200">
                                        Update
                                    </button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900">
                                            Two-Factor Authentication
                                        </h4>
                                        <p className="text-sm text-gray-500">
                                            Add an extra layer of security
                                        </p>
                                    </div>
                                    <button className="px-3 py-2 bg-gray-100 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-200">
                                        Enable
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
