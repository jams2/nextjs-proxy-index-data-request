import { Page } from '../../components';

// Static generation, so that client navigation to this page fetches its data from `/_next/data`.
export const getStaticProps = async () => ({ props: {} });

export default function IndexPage() {
    return <Page heading="/index" />;
}
