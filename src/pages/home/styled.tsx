import styled from 'styled-components';
import background from '../../assets/home-background.svg';


export const PageHome = styled.div`
    height: 100vh;
    background: url(${background}) no-repeat;
    background-position-x: 600px;
    background-position-y:bottom;
    background-size:50%;
    
    
`;
export const Content = styled.div`
    width: 100%;
    height: 100%;
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 30px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`
export const Header = styled.header`
    margin: 48px 0 0;
`;

export const Main = styled.main`
    flex: 1;
    max-width: 560px;
    display: flex;
    flex-direction: column;
    justify-content: center;

    h1 {
        font-size: 54px;
        color: var(--title-color);
    }

    p {
        font-size: 24px;
        margin-top: 24px;
        line-height: 38px;
    }

    a {
        width: 100%;
        max-width: 360px;
        height: 72px;
        background: var(--primary-color);
        border-radius: 8px;
        text-decoration: none;
        display: flex;
        align-items: center;
        overflow: hidden;
        margin-top: 40px;
    }

    span {
        display: block;
        background: rgba(0, 0, 0, 0.08);
        width: 72px;
        height: 72px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.2s;
    }

    svg {
        color: #FFF;
        width: 20px;
        height: 20px;
    }

    strong {
        flex: 1;
        text-align: center;
        color: #FFF;
    }
`