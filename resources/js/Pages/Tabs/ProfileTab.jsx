import UpdateProfileInformationForm from '@/Pages/Profile/Partials/UpdateProfileInformationForm';
import UpdatePasswordForm from '@/Pages/Profile/Partials/UpdatePasswordForm';
import DeleteUserForm from '@/Pages/Profile/Partials/DeleteUserForm';

export default function ProfileTab({ mustVerifyEmail, status }) {
    return (
        <div className="mx-auto max-w-3xl space-y-6 py-6">
            <div className="bg-white p-6 shadow-sm rounded-xl border border-gray-200">
                <UpdateProfileInformationForm
                    mustVerifyEmail={mustVerifyEmail}
                    status={status}
                />
            </div>

            <div className="bg-white p-6 shadow-sm rounded-xl border border-gray-200">
                <UpdatePasswordForm />
            </div>

            <div className="bg-white p-6 shadow-sm rounded-xl border border-gray-200">
                <DeleteUserForm />
            </div>
        </div>
    );
}
