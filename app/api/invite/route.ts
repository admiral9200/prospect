import { NextResponse, NextRequest } from 'next/server';
import { EmailTemplate } from '@/app/components/EmailTemplate/EmailTemplate';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const POST = async (req: NextRequest, res: NextResponse) => {
    try {
        const body = await req.json()
        const name = body.name
        const email = body.email
        const link = body.link
        console.log(body);

        const data = await resend.emails.send({
            from: 'support@prosp.ai',
            to: [email],
            subject: "Invitation",
            react: EmailTemplate({ name: name, link: link }) as React.ReactElement,
        });

        return NextResponse.json({ data: data, message: 'Invitation has been sent successfully' }, {
            status: 200
        })

    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Something went wrong' }, {
            status: 500
        })
    }
}