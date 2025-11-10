export default function Metadata() {
    const data = {
        title: 'Waku',
        description: 'Empty Waku Template By Sphe.',
        icon: '/images/favicon.png',
    }

    return (
        <>
            <title>{data.title}</title>
            <meta name="description" content={data.description} />
            <link rel="icon" type="image/png" href={data.icon} />
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
            <link
                rel="stylesheet"
                href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap"
                precedence="font"
            />
        </>
    )
}