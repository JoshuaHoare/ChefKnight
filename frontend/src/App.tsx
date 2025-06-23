import React, { useEffect, useState } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ContentView from './components/ContentView';
import Header from './components/Header';
import { ApiService } from './services/ApiService';
import { ContentStatus } from './types';

const App: React.FC = () => {
  const [contentStatus, setContentStatus] = useState<ContentStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const status = await ApiService.getStatus();
        setContentStatus(status);
        setLoading(false);
      } catch (err) {
        setError('Failed to load content status. Please try again.');
        setLoading(false);
      }
    };

    fetchStatus();
  }, []);

  const handleSelectFolder = (folder: string) => {
    setSelectedFolder(folder);
    setSelectedFile(null);
  };

  const handleSelectFile = (folder: string, file: string) => {
    setSelectedFolder(folder);
    setSelectedFile(file);
  };

  return (
    <Router>
      <Flex direction="column" h="100vh">
        <Header 
          gitStatus={contentStatus?.git} 
          loading={loading}
        />
        <Flex flex="1" overflow="hidden">
          <Sidebar
            folders={contentStatus?.folders || []}
            content={contentStatus?.content || {}}
            selectedFolder={selectedFolder}
            selectedFile={selectedFile}
            onSelectFolder={handleSelectFolder}
            onSelectFile={handleSelectFile}
            loading={loading}
          />
          <Box flex="1" p={4} overflowY="auto">
            <Routes>
              <Route 
                path="/:folder/:file" 
                element={<ContentView />} 
              />
              <Route 
                path="/" 
                element={
                  <Box p={8} textAlign="center" color="gray.500">
                    Select an entry from the sidebar to view its content
                  </Box>
                } 
              />
            </Routes>
          </Box>
        </Flex>
      </Flex>
    </Router>
  );
};

export default App;
