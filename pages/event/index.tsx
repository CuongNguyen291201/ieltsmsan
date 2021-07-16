import React from 'react';

import Layout from '../../components/Layout';
import MainHeader from '../../components/MainHeader';
import MainMenu from '../../components/MainMenu';
import Event from '../../components/Event/EventDetail';

const EventPage = () => {
    return (
        <Layout>
            <MainHeader />
            <MainMenu />
            <Event />
        </Layout>
    )
}

export default EventPage
