import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';
import FormLogin from '@/components/auth/FormLogin';

const Login = () => {

    return (
        <Card className="w-[96%] max-w-md animate-fade-in bg-card/70">
            <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 shadow-[1px_1px_5px_rgba(0,0,0,0.3)]">
                    <BookOpen className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="font-display text-2xl">Masuk Tugasku</CardTitle>
                <CardDescription>Kelola tugas kuliahmu dengan mudah</CardDescription>
            </CardHeader>
            <FormLogin />
        </Card>
    );
};

export default Login;
