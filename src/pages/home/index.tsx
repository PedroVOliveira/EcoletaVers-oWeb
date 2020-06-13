import React from 'react';
import { FiLogIn } from 'react-icons/fi';
// Componente que resolve o problema de recarregamento do dom
import { Link } from 'react-router-dom';
// import './styles.css';
import { PageHome, Content,Header, Main } from './styled';
import logo from '../../assets/logo.svg';
const Home = () => {
	return (
		<PageHome>
			<Content>
				<Header>
					<img src={logo} alt="Logo"/>
				</Header>
				<Main>
					<h1>Seu marketplace de coleta de resíduos.</h1>
					<p>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</p>
					<Link to="/create-point">
						<span>
							<FiLogIn />
						</span>
						<strong>
							Cadastre um ponto de coleta
						</strong>
					</Link>
				</Main>
			</Content>
		</PageHome>
	)
}

export default Home;