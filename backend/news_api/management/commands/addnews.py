import csv
import os
from django.core.management.base import BaseCommand
from django.conf import settings
from news_api.models import Article  # Make sure to use your actual app name

class Command(BaseCommand):
    """
    Django management command to import news articles from a CSV file into the database.

    The CSV file must have the following columns:
    id, title, subtitle, type, content, summary

    How to run:
    python manage.py import_news path/to/your/news_data.csv
    """
    help = 'Imports news articles from a specified CSV file into the database.'

    def add_arguments(self, parser):
        """
        Adds a required command-line argument for the CSV file path.
        """
        parser.add_argument('csv_file_path', type=str, help='The full path to the CSV file to be imported.')

    def handle(self, *args, **options):
        """
        The main logic for the command.
        """
        # This is the corrected line. It uses the argument's name as the key.
        csv_file_path = options['csv_file_path']

        # --- 1. Validate the File Path ---
        if not os.path.exists(csv_file_path):
            self.stdout.write(self.style.ERROR(f"File not found at: {csv_file_path}"))
            return

        self.stdout.write(self.style.SUCCESS(f"Starting import from: {csv_file_path}"))

        # --- 2. Read the CSV and Update/Create Articles ---
        created_count = 0
        updated_count = 0

        try:
            with open(csv_file_path, mode='r', encoding='utf-8') as csvfile:
                # DictReader allows accessing columns by name
                reader = csv.DictReader(csvfile)
                
                for row in reader:
                    try:
                        # Use update_or_create to avoid duplicates.
                        # It tries to get an article with the given id, and if it
                        # finds one, it updates it. Otherwise, it creates a new one.
                        article, created = Article.objects.update_or_create(
                            id=row['id'],
                            defaults={
                                'title': row['title'],
                                'subtitle': row['subtitle'],
                                'article_type': row['type'], # Assuming your model field is 'article_type'
                                'content': row['content'],
                                'summary': row['summary'],
                            }
                        )

                        if created:
                            created_count += 1
                        else:
                            updated_count += 1

                    except Exception as e:
                        self.stdout.write(self.style.ERROR(f"Error processing row with ID {row.get('id', 'N/A')}: {e}"))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f"An unexpected error occurred: {e}"))
            return

        # --- 3. Report the Results ---
        self.stdout.write(self.style.SUCCESS("-" * 50))
        self.stdout.write(self.style.SUCCESS("Import process completed."))
        self.stdout.write(self.style.SUCCESS(f"Successfully created: {created_count} new articles."))
        self.stdout.write(self.style.SUCCESS(f"Successfully updated: {updated_count} existing articles."))

