import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-sm border">
        <h1 className="text-2xl font-bold mb-2">Admin login</h1>
        <p className="text-gray-600 text-sm mb-6">
          Inloggen op het beheerpaneel van CarStore Parts.
        </p>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">E-mail</label>
            <Input type="email" placeholder="admin@carstoreparts.nl" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Wachtwoord</label>
            <Input type="password" placeholder="••••••••" />
          </div>
          <Button className="w-full">Inloggen</Button>
        </form>
      </div>
    </div>
  );
}
