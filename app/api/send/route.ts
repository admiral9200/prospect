import { NextResponse, NextRequest } from 'next/server';
import { EmailTemplate } from '@/app/components/EmailTemplate/EmailTemplate';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const POST = async (req: NextRequest, res: NextResponse) => {
    // const body_example = {
    //     "subject": "Testing",
    //     "send_address": "yann@prosp.ai",
    //     "recipient_address": "obaidmuneer55@gmail.com",
    //     "html": "<h1>Hi</h1>"
    // }
    try {
        const body = await req.json()
        const subject = body.subject
        const send_address = body.send_address
        const recipient_address = body.recipient_address
        const html = body.html

        const data = await resend.emails.send({
            from: send_address,
            to: [recipient_address],
            subject: subject,
            react: EmailTemplate({ html: html }) as React.ReactElement,
        });

        return NextResponse.json({ data: data, message: 'Email has been sent successfully' }, {
            status: 200
        })

    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Something went wrong' }, {
            status: 500
        })
    }
}