from typing import List, Dict, Any, cast
import os
import requests
from bs4 import BeautifulSoup
import time
import random
import urllib.parse
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def perform_bing_search(query: str) -> List[Dict[str, str]]:
    encoded_query = urllib.parse.quote(query)
    search_results = []
    
    try:
        chrome_options = Options()
        chrome_options.add_argument("--headless")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument("--window-size=1920,1080")
        chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36")
        
        driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)
        
        target_url = f"https://www.bing.com/search?q={encoded_query}&rdr=1&first=1"
        print(f"Searching URL: {target_url}")
        
        driver.get(target_url)
        
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "li.b_algo"))
        )
        
        print("Search results loaded successfully")
    
        with open("/tmp/bing_search_response.html", "w", encoding="utf-8") as f:
            f.write(driver.page_source)
        print(f"Saved response HTML to /tmp/bing_search_response.html")
        
        soup = BeautifulSoup(driver.page_source, 'html.parser')
        complete_data = soup.find_all("li", {"class": "b_algo"})
        
        print(f"Found {len(complete_data)} results with b_algo class")
        
        for i in range(min(3, len(complete_data))):
            try:
                result = complete_data[i]
                a_tag = result.find("a")
                
                if a_tag:
                    title = a_tag.text.strip()
                    url = a_tag.get("href")
                    
                    caption_div = result.find("div", {"class": "b_caption"})
                    snippet = caption_div.text.strip() if caption_div else ""
                    
                    if title and url:
                        search_results.append({
                            "title": title,
                            "url": url,
                            "snippet": snippet,
                            "content": ""
                        })
            except Exception as e:
                print(f"Error processing result {i}: {str(e)}")
        
        if len(search_results) < 3:
            try:
                target_url = f"https://www.bing.com/search?q={encoded_query}&rdr=1&first=11"
                print(f"Searching second page: {target_url}")
                
                driver.get(target_url)
                
                WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((By.CSS_SELECTOR, "li.b_algo"))
                )
                
                soup = BeautifulSoup(driver.page_source, 'html.parser')
                complete_data = soup.find_all("li", {"class": "b_algo"})
                
                print(f"Found {len(complete_data)} results on second page")
                
                needed = 3 - len(search_results)
                
                for i in range(min(needed, len(complete_data))):
                    try:
                        result = complete_data[i]
                        a_tag = result.find("a")
                        
                        if a_tag:
                            title = a_tag.text.strip()
                            url = a_tag.get("href")
                            
                            caption_div = result.find("div", {"class": "b_caption"})
                            snippet = caption_div.text.strip() if caption_div else ""
                            
                            if title and url:
                                search_results.append({
                                    "title": title,
                                    "url": url,
                                    "snippet": snippet,
                                    "content": ""
                                })
                    except Exception as e:
                        print(f"Error processing second page result {i}: {str(e)}")
                    
                    if len(search_results) >= 3:
                        break
            except Exception as e:
                print(f"Error fetching second page: {str(e)}")
        
        if len(search_results) < 1:
            print("No results found with specific selectors, trying generic approach")
            
            for link in soup.find_all('a'):
                url = link.get('href')
                
                if (url and url.startswith('http') and 
                    'bing.com' not in url and 
                    'microsoft.com' not in url and 
                    'msn.com' not in url):
                    
                    title = link.text.strip()
                    if title and len(title) > 5:
                        search_results.append({
                            "title": title,
                            "url": url,
                            "snippet": "",
                            "content": ""
                        })
                        
                        if len(search_results) >= 3:
                            break
        
        driver.quit()
        print(f"Final results count: {len(search_results)}")
        for i, result in enumerate(search_results):
            print(f"Result {i+1}: {result['title'][:30]}... - {result['url']}")
        
        return search_results
    except Exception as e:
        print(f"Search error: {str(e)}")
        try:
            if 'driver' in locals() and driver:
                driver.quit()
        except:
            pass
        return [{"error": f"Error with Bing search: {str(e)}"}]

def scrape_webpage(url: str) -> str:
    try:
        time.sleep(random.uniform(1, 3))
        
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            "Referer": "https://www.bing.com/",
            "DNT": "1",
        }
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        for script in soup(["script", "style", "nav", "header", "footer"]):
            script.decompose()
        
        text = soup.get_text(separator='\n')
        
        lines = (line.strip() for line in text.splitlines())
        chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
        text = '\n'.join(chunk for chunk in chunks if chunk)
        
        return text[:5000] + "..." if len(text) > 5000 else text
    except Exception as e:
        return f"Error scraping webpage: {str(e)}"

def search_knowledge_base(query: str) -> str:
    print(f"Searching for: {query}")
    
    search_results = perform_bing_search(query)
    
    if isinstance(search_results, list) and len(search_results) > 0 and "error" in search_results[0]:
        return f"Error performing search: {search_results[0]['error']}"
    
    print(f"Found {len(search_results)} search results")
    
    if not search_results:
        return "No results found in the knowledge base."
    
    for result in search_results:
        if result.get("url"):
            print(f"Scraping: {result['url']}")
            result["content"] = scrape_webpage(result["url"])
    
    formatted_results = "### Search Results\n\n"
    for i, item in enumerate(search_results, 1):
        formatted_results += f"**Result {i}**\n"
        formatted_results += f"Title: {item.get('title', '')}\n"
        formatted_results += f"Snippet: {item.get('snippet', '')}\n"
        formatted_results += f"Content: {item.get('content', '')}\n"
        
        url = item.get('url', '')
        if url:
            formatted_results += f"Source: {url}\n"
        
        formatted_results += "\n---\n\n"
    
    return formatted_results
