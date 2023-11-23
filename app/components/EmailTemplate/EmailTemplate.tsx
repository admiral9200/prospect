
interface EmailTemplateProps {
    name?: string;
    link?: string;
    html?: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({ name, link, html }) => {
    if (html) {
        return <div>
            <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
    }
    if (name && link) {
        return <div>
            <h1>You have been Invited to join workspace on <a href="https://prosp.ai/" target='_blank'>Props.ai</a>, {name}!</h1>
            <p><a href={link} target='_blank'>Click here to join</a></p>
        </div>
    }
};
