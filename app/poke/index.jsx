import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Picker, Button } from 'react-native';
import { Link } from 'expo-router';

const App = () => {
    const [element, setElement] = useState('');
    const [pokemon, setPokemon] = useState('');
    const [pokemons, setPokemons] = useState([]);
    const [elements, setElements] = useState([]);
    const [filteredPokemons, setFilteredPokemons] = useState([]);
    const [img, setImg] = useState('');

    async function getPokemons() {
        try {
            const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100');
            const data = await res.json();
            setPokemons(data.results);
            setFilteredPokemons(data.results);
        } catch (error) {
            console.error(error);
        }
    }

    async function getPokemonTypes() {
        try {
            const res = await fetch('https://pokeapi.co/api/v2/type');
            const data = await res.json();
            setElements(data.results);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getPokemons();
        getPokemonTypes();
    }, []);

    const handleElementChange = async (element) => {
        setElement(element);
        let pokemonList = [...pokemons];
        if (element) {
            try {
                const response = await fetch(`https://pokeapi.co/api/v2/type/${element}`);
                const data = await response.json();
                const filteredPokemonsByType = data.pokemon.map(p => p.pokemon.name);
                pokemonList = pokemonList.filter(p => filteredPokemonsByType.includes(p.name));
            } catch (error) {
                console.error(error);
            }
        }
        setFilteredPokemons(pokemonList);
    };

    async function getImg(url) {
        try {
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    setImg(data.sprites.front_default);
                });
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Pokémon Finder</Text>

            <Picker
                selectedValue={element}
                style={styles.picker}
                onValueChange={handleElementChange}
            >
                <Picker.Item label="Selecione um tipo" value="" />
                {elements.map((type, index) => (
                    <Picker.Item key={index} label={type.name} value={type.name} />
                ))}
            </Picker>

            <Picker
                selectedValue={pokemon}
                style={styles.picker}
                onValueChange={(value) => {
                    setPokemon(value);
                    getImg(value);
                }}
            >
                <Picker.Item label="Selecione um pokemon" value="" />
                {filteredPokemons.map((poke, index) => (
                    <Picker.Item key={index} label={poke.name} value={poke.url} />
                ))}
            </Picker>

            {img ? (
                <Image
                    source={{ uri: img }}
                    style={styles.image}
                />
            ) : (
                <Text style={styles.placeholderText}>Selecione um Pokémon para visualizar a imagem</Text>
            )}

            <View style={styles.backButton}>
                <Link href="../">
                    <Text style={styles.linkText}>Voltar</Text>
                </Link>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginBottom: 20,
    },
    picker: {
        width: '80%',
        height: 50,
        backgroundColor: '#fff',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    image: {
        width: 200,
        height: 200,
        marginTop: 20,
        borderRadius: 100,
        borderWidth: 2,
        borderColor: '#4CAF50',
    },
    placeholderText: {
        fontSize: 16,
        color: '#777',
        marginTop: 20,
    },
    backButton: {
        marginTop: 30,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#4CAF50',
        borderRadius: 20,
    },
    linkText: {
        color: '#fff',
        fontSize: 18,
    },
});

export default App;
''