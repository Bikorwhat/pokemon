import { useState } from 'react';

interface PokemonData {
	id: number;
	name: string;
	types: string[];
	abilities: string[];
	image: string;
}

function Pokemon() {
	const [pokemonName, setPokemonName] = useState<string>('');
	const [pokemonData, setPokemonData] = useState<PokemonData | null>(null);
	const [error, setError] = useState<string | null>(null);

	const fetchPokemon = async () => {
		if (!pokemonName.trim()) {
			setError("Please enter a valid Pokémon name or ID.");
			setPokemonData(null);
			return;
		}

		try {
			setError(null);
			const response = await fetch(`/api/pokemon/${ pokemonName }`);

			const contentType = response.headers.get("content-type");
			if (!response.ok || !contentType || !contentType.includes("application/json")) {
				const errorText = await response.text();
				throw new Error(`Error: ${errorText}`);
			}
			
			const data = await response.json();

			const formattedData: PokemonData = {
				id: data.id,
				name: data.name,
				types: data.types,
				abilities: data.abilities,
				image: data.image,
			};

			setPokemonData(formattedData);
		} catch (err: any) {
			setError(err.message);
			setPokemonData(null);
		}
	};

	return (
		<div style={{ padding: '20px' }}>
			<h1>Pokémon Finder</h1>
			<input
				type="text"
				value={ pokemonName }
				onChange={ (event) => setPokemonName(event.target.value) }
				placeholder="Enter Pokémon name or ID"
			/>
			<button onClick={ fetchPokemon }>Get Pokémon</button>
			{ error && (
				<p style={{ color: 'red' }}>
					{ error }
				</p> 
			)}
			{ pokemonData && (
				<div>
					<h2>{ pokemonData.name } (ID: { pokemonData.id })</h2>
					<img src={ pokemonData.image} alt={ pokemonData.name } />
					<p>
						<strong>Types:</strong>
						{ pokemonData.types.join(', ') }
					</p>
					<p>
						<strong>Abilities:</strong>
						{ pokemonData.abilities.join(', ') }
					</p>
				</div>
			)}
		</div>
	);
}

export default Pokemon;
