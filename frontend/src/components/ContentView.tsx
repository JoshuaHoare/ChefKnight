import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Heading, 
  Text, 
  Divider, 
  Tag,
  TagLabel,
  HStack,
  VStack,
  Skeleton,
  Alert,
  AlertIcon
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ApiService } from '../services/ApiService';

interface ContentParams {
  folder?: string;
  file?: string;
}

interface ContentMetadata {
  [key: string]: any;
}

const ContentView: React.FC = () => {
  const { folder, file } = useParams<ContentParams>();
  const [content, setContent] = useState<string>('');
  const [metadata, setMetadata] = useState<ContentMetadata | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      if (!folder || !file) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Simulate fetching content since we don't have the actual endpoint yet
        // In the future, we'll replace this with a real API call
        setTimeout(async () => {
          try {
            // This is a placeholder for actual API implementation
            // const data = await ApiService.getContentFile(folder, file);
            
            // Simulated response for development
            let simulatedContent = '';
            let simulatedMetadata = {};
            
            if (folder === 'kingdoms' && file === 'aldoria') {
              simulatedMetadata = {
                name: 'Aldoria',
                type: 'Kingdom',
                region: 'Northern Realms',
                ruler: 'King Thalion IV',
                population: '3.5 million',
                climate: 'Temperate',
                founded: '892 CR',
                status: 'Active'
              };
              simulatedContent = `
# Kingdom of Aldoria

Aldoria is one of the oldest human kingdoms in the Northern Realms, known for its rich culinary traditions and the famed Culinary Knights.

## Geography

Aldoria spans the fertile plains between the Azure Mountains and the Silverleaf Forest, with the Crystal River running through its center.

## Government

The kingdom is ruled by King Thalion IV of House Valorian, with a council of Noble Chefs serving as advisors on matters of state and cuisine.

## Culture

Allorians place great value on the culinary arts, with cooking competitions held monthly in the capital city. The most skilled chefs are elevated to the rank of Culinary Knight, serving both as royal chefs and battlefield commanders.
              `;
            } else if (folder === 'characters' && file === 'chef_brandish') {
              simulatedMetadata = {
                name: 'Chef Brandish',
                title: 'Royal Culinary Knight',
                kingdom: 'Aldoria',
                race: 'Human',
                specialties: ['Battle Cooking', 'Fire Cuisine', 'Defensive Pastry'],
                signature_dish: 'Flambé Fortress Soufflé',
                weapon: 'Whisk Blade',
                status: 'Active'
              };
              simulatedContent = `
# Chef Brandish

Chef Brandish is one of the most renowned Culinary Knights in the kingdom of Aldoria, famous for his mastery of battle cooking and fire cuisine.

## Background

Born to a humble baker in the outskirts of Highcrown, Brandish showed exceptional talent from an early age, able to create perfect pastries that could deflect arrows when hardened using his special technique.

## Skills

Brandish is particularly known for his "Flambé Fortress" technique, where he creates elaborate defensive structures from caramelized sugar that are both beautiful and functional on the battlefield.

## Recent Achievements

Recently appointed as Head Knight of the Royal Kitchen, Brandish successfully defended the castle during the Siege of Sweetwater by creating an impenetrable dome of spun sugar reinforced with magical herbs.
              `;
            } else {
              // For other files, generate placeholder content
              simulatedContent = `# ${file}\n\nContent for ${file} in the ${folder} category will appear here.`;
              simulatedMetadata = {
                name: file,
                category: folder
              };
            }
            
            setMetadata(simulatedMetadata);
            setContent(simulatedContent);
            setLoading(false);
          } catch (err) {
            setError('Failed to load content. Please try again.');
            setLoading(false);
          }
        }, 800);
      } catch (err) {
        setError('Failed to load content. Please try again.');
        setLoading(false);
      }
    };

    fetchContent();
  }, [folder, file]);

  if (!folder || !file) {
    return (
      <Box p={8} textAlign="center" color="gray.500">
        Select an entry from the sidebar to view its content
      </Box>
    );
  }

  if (loading) {
    return (
      <Box p={6}>
        <Skeleton height="40px" width="50%" mb={6} />
        <Skeleton height="20px" width="30%" mb={4} />
        <Skeleton height="20px" mb={4} />
        <Skeleton height="20px" mb={4} />
        <Skeleton height="20px" mb={4} width="80%" />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        {error}
      </Alert>
    );
  }

  return (
    <Box p={6} bg="white" borderRadius="md" shadow="sm">
      {metadata && (
        <Box mb={6} bg="gray.50" p={4} borderRadius="md">
          <VStack align="start" spacing={3}>
            {Object.entries(metadata).map(([key, value]) => (
              <Box key={key}>
                <Text fontSize="sm" fontWeight="medium" color="gray.500" textTransform="uppercase" mb={1}>
                  {key}
                </Text>
                {Array.isArray(value) ? (
                  <HStack spacing={2} wrap="wrap">
                    {value.map((item, i) => (
                      <Tag size="md" key={i} colorScheme="blue" variant="subtle">
                        <TagLabel>{item}</TagLabel>
                      </Tag>
                    ))}
                  </HStack>
                ) : (
                  <Text fontWeight="normal">{value}</Text>
                )}
              </Box>
            ))}
          </VStack>
        </Box>
      )}

      <Box className="markdown-content">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {content}
        </ReactMarkdown>
      </Box>
    </Box>
  );
};

export default ContentView;
