import sys
from weasyprint import HTML

def generate_pdf(html_path, output_path):
    try:
        HTML(html_path).write_pdf(output_path)
        print(f"Successfully generated PDF at {output_path}")
    except Exception as e:
        print(f"Error generating PDF: {e}")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python3 generate_pdf.py <html_path> <output_path>")
        sys.exit(1)
    
    generate_pdf(sys.argv[1], sys.argv[2])
