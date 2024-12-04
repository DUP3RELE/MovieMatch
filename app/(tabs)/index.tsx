import React, { useState } from "react";
import {
	StyleSheet,
	Platform,
	View,
	TextInput,
	Text,
	Alert,
	TouchableOpacity,
	useColorScheme,
} from "react-native";
import { WebView } from "react-native-webview";
import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

interface HomeScreenProps {
	youtubeLink?: string;
}

export default function HomeScreen({ youtubeLink }: HomeScreenProps) {
	const defaultYoutubeLink = "https://www.youtube.com/embed/dQw4w9WgXcQ";
	const videoUrl = youtubeLink || defaultYoutubeLink;

	const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
	const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
	const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
	const [additionalInfo, setAdditionalInfo] = useState("");
	const [letterCount, setLetterCount] = useState(0);
	const [submittedData, setSubmittedData] = useState(null);
	const maxLetters = 180;

	const colorScheme = useColorScheme();

	const textColor = colorScheme === "dark" ? "#FFF" : "#000";

	const handleSubmit = () => {
		const dataToSend = {
			genres: selectedGenres,
			types: selectedTypes,
			platforms: selectedPlatforms,
			info: additionalInfo,
		};
		setSubmittedData(dataToSend);
	};

	const toggleSelection = (
		type: "genre" | "type" | "platform",
		value: string
	) => {
		if (type === "genre") {
			setSelectedGenres((prev) =>
				prev.includes(value)
					? prev.filter((item) => item !== value)
					: [...prev, value]
			);
		} else if (type === "type") {
			setSelectedTypes((prev) =>
				prev.includes(value)
					? prev.filter((item) => item !== value)
					: [...prev, value]
			);
		} else if (type === "platform") {
			setSelectedPlatforms((prev) =>
				prev.includes(value)
					? prev.filter((item) => item !== value)
					: [...prev, value]
			);
		}
	};

	const handleAdditionalInfoChange = (text: string) => {
		const count = text.replace(/\s+/g, "").length;
		setLetterCount(count <= maxLetters ? count : letterCount);
		if (count <= maxLetters) {
			setAdditionalInfo(text);
		}
	};
	// logika dla przycisku znajdź film
	const handleFindMovie = () => {
		if (selectedGenres.length === 0 || selectedTypes.length === 0) {
			Alert.alert("Błąd", "Proszę wybrać gatunek i rodzaj filmu.");
		} else {
			console.log(
				`Searching for movie... ${selectedGenres}, ${selectedPlatforms}, ${selectedTypes}, ${additionalInfo}`
			);
		}
	};

	// logika dla przycisku znajdź losowy
	const handleFindRandomMovie = () => {
		console.log("Finding random movie...");
	};

	return (
		<ParallaxScrollView
			headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
			headerImage={
				<View style={styles.videoContainer}>
					{Platform.select({
						web: (
							<iframe
								src={videoUrl}
								style={styles.youtubeVideo}
								allowFullScreen
							/>
						),
						default: (
							<WebView
								source={{ uri: videoUrl }}
								style={styles.youtubeVideo}
								allowsFullscreenVideo
							/>
						),
					})}
				</View>
			}
		>
			<ThemedView style={styles.titleContainer}>
				<ThemedText type='title'>MovieMatch</ThemedText>
				<HelloWave />
			</ThemedView>

			<ThemedView style={styles.stepContainer}>
				<ThemedText type='subtitle'>Krok 1: Wybierz gatunek</ThemedText>
				<View style={styles.buttonContainer}>
					{[
						"horror",
						"komedia",
						"akcja",
						"sci-fi",
						"thriller",
						"romantyczny",
						"dokumentalny",
						"biograficzny",
						"dramat",
					].map((genre) => (
						<ThemedView
							key={genre}
							style={[
								styles.genreButton,
								selectedGenres.includes(genre) && styles.selectedButton,
							]}
						>
							<ThemedText onPress={() => toggleSelection("genre", genre)}>
								{genre}
							</ThemedText>
						</ThemedView>
					))}
				</View>
			</ThemedView>

			<ThemedView style={styles.stepContainer}>
				<ThemedText type='subtitle'>Krok 2: Wybierz rodzaj</ThemedText>
				<View style={styles.buttonContainer}>
					{[
						"animowany",
						"dla dzieci",
						"dla dorosłych",
						"niszowy",
						"popularny",
						"łatwy w odbiorze",
						"trudny w odbiorze",
					].map((type) => (
						<ThemedView
							key={type}
							style={[
								styles.typeButton,
								selectedTypes.includes(type) && styles.selectedButton,
							]}
						>
							<ThemedText onPress={() => toggleSelection("type", type)}>
								{type}
							</ThemedText>
						</ThemedView>
					))}
				</View>
			</ThemedView>
			<ThemedView style={styles.stepContainer}>
				<ThemedText type='subtitle'>Krok 3: Wybierz platformę</ThemedText>
				<View style={styles.buttonContainer}>
					{["dowolna", "HBO MAX", "NETFLIX", "DISNEY+", "PRIME", "CANAL+"].map(
						(platform) => (
							<ThemedView
								key={platform}
								style={[
									styles.typeButton,
									selectedPlatforms.includes(platform) && styles.selectedButton,
								]}
							>
								<ThemedText
									onPress={() => toggleSelection("platform", platform)}
								>
									{platform}
								</ThemedText>
							</ThemedView>
						)
					)}
				</View>
			</ThemedView>

			<ThemedView style={styles.stepContainer}>
				<ThemedText type='subtitle'>
					Krok 4: Wpisz dodatkowe zalecenia
				</ThemedText>
				<TextInput
					style={[styles.input, { color: textColor }]}
					multiline
					maxLength={maxLetters}
					onChangeText={handleAdditionalInfoChange}
					value={additionalInfo}
					placeholder='Wpisz maksymalnie 180 liter'
				/>
				<Text style={styles.letterCount}>
					{letterCount}/{maxLetters} liter
				</Text>
			</ThemedView>

			<View style={styles.buttonContainer}>
				<TouchableOpacity
					style={styles.findButton}
					onPress={handleFindMovie}
				>
					<Text style={styles.buttonText}>Znajdź film</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.findButton}
					onPress={handleFindRandomMovie}
				>
					<Text style={styles.buttonText}>Znajdź losowy film</Text>
				</TouchableOpacity>
			</View>
		</ParallaxScrollView>
	);
}

const styles = StyleSheet.create({
	videoContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		height: 300,
		backgroundColor: "#000",
	},
	youtubeVideo: {
		width: 320,
		height: 180,
	},
	titleContainer: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		gap: 8,
	},
	stepContainer: {
		gap: 8,
		marginBottom: 8,
	},
	buttonContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 8,
		justifyContent: "center",
		marginTop: 16,
	},
	genreButton: {
		padding: 8,
		borderWidth: 1,
		borderRadius: 4,
	},
	typeButton: {
		padding: 8,
		borderWidth: 1,
		borderRadius: 4,
	},
	selectedButton: {
		backgroundColor: "#4CAF50",
	},
	input: {
		borderWidth: 1,
		padding: 10,
		borderRadius: 4,
	},
	letterCount: {
		marginTop: 4,
		fontSize: 12,
		color: "#666",
	},
	findButton: {
		backgroundColor: "#4CAF50",
		paddingVertical: 12,
		paddingHorizontal: 24,
		borderRadius: 4,
		marginVertical: 8,
	},
	buttonText: {
		color: "#fff",
		fontSize: 16,
		textAlign: "center",
	},
});
