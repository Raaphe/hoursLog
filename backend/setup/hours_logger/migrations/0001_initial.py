# Generated by Django 3.2.19 on 2023-12-27 18:07

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Employee',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('firstName', models.CharField(max_length=50)),
                ('lastName', models.CharField(max_length=50)),
                ('address', models.TextField()),
                ('phoneNumber', models.CharField(max_length=10)),
                ('email', models.EmailField(max_length=254)),
            ],
        ),
        migrations.CreateModel(
            name='Invoice',
            fields=[
                ('invoice', models.AutoField(primary_key=True, serialize=False)),
                ('date', models.DateField()),
                ('employee', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='invoices', to='hours_logger.employee')),
            ],
        ),
        migrations.CreateModel(
            name='Shift',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('hours', models.DurationField()),
                ('price', models.DecimalField(decimal_places=2, max_digits=7)),
                ('total', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('date', models.DateField()),
                ('description', models.TextField()),
                ('invoiced', models.BooleanField(default=False)),
                ('invoice', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='shifts', to='hours_logger.invoice')),
            ],
        ),
    ]
