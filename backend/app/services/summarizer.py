import logging
from app.config import settings

logger = logging.getLogger(__name__)

async def generate_summary(title: str, abstract: str = None) -> str | None:
    if not settings.GEMINI_API_KEY:
        logger.info("GEMINI_API_KEY is not set. Skipping AI summarization.")
        return None
        
    if not abstract or len(abstract.strip()) < 20:
        logger.info("No abstract provided or too short for summarization.")
        return None
        
    try:
        from google import genai
        client = genai.Client(api_key=settings.GEMINI_API_KEY)
        
        prompt = f'''
        Analyze the following research article metadata. 
        Note: You are only analyzing the title and abstract, not the full paper.
        
        Title: {title}
        Abstract: {abstract}
        
        Provide a concise response containing:
        - Short Summary (2-3 sentences max)
        - Key Contribution (1 sentence)
        - Important Keywords (3-5 keywords)
        '''
        
        response = await client.aio.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
        )
        return response.text
        
    except Exception as e:
        logger.error(f"AI summarization failed: {str(e)}")
        # Must fail gracefully
        return None
